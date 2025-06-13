
import { app,  type HttpFunctionOptions, type HttpHandler } from '@azure/functions';
import type { ServiceBase } from '@cellix/api-services-spec';
import api,{ trace, SpanStatusCode, type Tracer } from '@opentelemetry/api';



export interface UninitializedServiceRegistry<ContextType = unknown>  {
  registerService(service: ServiceBase): UninitializedServiceRegistry<ContextType>;
}

export interface InitializedServiceRegistry  {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getService<T extends ServiceBase>(serviceType: new (...args: any[]) => T): T ;
  get servicesInitialized(): boolean;
}

export interface AddHandler<ContextType = unknown> {
  registerAzureFunctionHandler(name: string, options: Omit<HttpFunctionOptions, "handler">, handlerCreator: (context: ContextType) => HttpHandler): AddHandler<ContextType>;
  setContext(contextCreator: (serviceRegistry: InitializedServiceRegistry) => ContextType): Promise<AddHandler<ContextType>>;

}


export class Cellix <ContextType>  implements UninitializedServiceRegistry, InitializedServiceRegistry, AddHandler {
  private contextInternal: ContextType | undefined;
  private readonly tracer:Tracer;
  //typescript dictionary of services including each services type and service instance
  private readonly servicesInternal:Map<string, ServiceBase> = new Map<string, ServiceBase>();
  private serviceInitializedInternal: boolean = false;
 
  private constructor() {
    this.tracer = trace.getTracer("cellix:data-access");
  }

  public registerService(service: ServiceBase): UninitializedServiceRegistry<ContextType> {
      this.servicesInternal.set(service.constructor.name, service);
      return this;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getService<T extends ServiceBase>(serviceType: new (...args: any[]) => T): T {
    const service = this.servicesInternal.get(serviceType.name);
    if (!service) {
        throw new Error(`Service ${serviceType.name} not found`);
    }
    return service as T;
  }

  public static initializeServices<ContextType>(serviceRegister: (serviceRegistry: UninitializedServiceRegistry<ContextType>) => void) : AddHandler<ContextType> {
    const newInstance = new Cellix<ContextType>();
      serviceRegister(newInstance);
      return newInstance;
  }
  

  private get context(): ContextType | undefined {
    if (!this.contextInternal) {
      throw new Error("Context not set. Please call setContext before accessing the context.");
    }
    return this.contextInternal;
  }

  public get servicesInitialized(): boolean {
    return this.serviceInitializedInternal;
  }

  public registerAzureFunctionHandler(name: string, options: Omit<HttpFunctionOptions, "handler">, handlerCreator: (context: ContextType) => HttpHandler): AddHandler<ContextType> {
    app.http(name, {
        ...options,
        handler: (request, context) => {
            if (!this.context) {
                throw new Error("Context not set. Please call setContext before registering handlers.");
            }
            return handlerCreator(this.context)(request, context);
        }
    });
    return this;
  }


  
  public setContext(contextCreator: (serviceRegistry: InitializedServiceRegistry) => ContextType): Promise<AddHandler<ContextType>> {
    console.log('registering appStart hook');
    app.hook.appStart(async () => { //context: AppStartContext
      const emptyRootContext = api.context.active(); // api.trace.setSpan(api.context.active(), api.trace.wrapSpanContext(undefined)); -- doesn't like undefined
      
      await api.context.with(emptyRootContext, async () => {
        await this.tracer.startActiveSpan("azure-function.appStart", async (span) => {
        
          try {
            await Promise.all(
              Array.from(this.servicesInternal.entries()).map(([key, service]) =>
                this.tracer.startActiveSpan(`Service ${key} starting`, async (serviceSpan) => {
                  try {
                    console.log(`StartService: Service ${key} starting`);
                    await service.startUp();
                    serviceSpan.setStatus({ code: SpanStatusCode.OK, message: `Service ${key} started` });
                    console.log(`StartService: Service ${key} started`);
                  } catch (err) {
                    serviceSpan.setStatus({ code: SpanStatusCode.ERROR });
                    if (err instanceof Error) {
                      serviceSpan.recordException(err);
                    }
                    throw err;
                  } finally {
                    serviceSpan.end();
                  }
                })
              )
            );
            
            span.setStatus({ code: SpanStatusCode.OK, message: `azure-function.appStart: Started` });
            this.serviceInitializedInternal = true;
            console.log('Cellix started');
            this.contextInternal = contextCreator(this); // Set the context using the provided contextCreator function
          }catch(err) {
            span.setStatus({ code: SpanStatusCode.ERROR });
            if( err instanceof Error) {
              span.recordException(err);
            }
            throw err;
          }finally {
            span.end();
          }
        });            
      });
    });
    console.log('Cellix appStart hook registered');
    app.hook.appTerminate(async () => { //_context: AppTerminateContext
        await Promise.all(
            Array.from(this.servicesInternal.values()).map(service => service.shutDown())
        );
        console.log('Cellix stopped');
    });
    console.log('Cellix appTerminate hook registered');
    return Promise.resolve(this);
  }
}
