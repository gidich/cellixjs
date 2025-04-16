
import { app, AppStartContext, AppTerminateContext, HttpFunctionOptions, HttpHandler } from '@azure/functions';
import type { ServiceBase } from 'api-services-spec';
import api,{ trace, SpanStatusCode, Tracer } from '@opentelemetry/api';


export interface UninitializedServiceRegistry<ContextType = any>  {
  registerService<T extends ServiceBase>(service: T): UninitializedServiceRegistry<ContextType>;
}

export interface InitializedServiceRegistry  {
  getService<T extends ServiceBase>(serviceType: new (...args: any[]) => T): T ;
}

export interface AddHandler<ContextType = any> {
  registerAzureFunctionHandler(name: string, options: Omit<HttpFunctionOptions, "handler">, handlerCreator: (context: ContextType) => HttpHandler): AddHandler<ContextType>;
  setContext(contextCreator: (serviceRegistry: InitializedServiceRegistry) => ContextType): Promise<void>;
}


export class Cellix <ContextType>  implements UninitializedServiceRegistry, InitializedServiceRegistry, AddHandler {
  private contextInternal: ContextType;
  private readonly tracer:Tracer;
  //typescript dictionary of services including each services type and service instance
  private readonly servicesInternal:Map<string, ServiceBase> = new Map<string, ServiceBase>();


  private constructor() {
    this.tracer = trace.getTracer("cellix:data-access");
  }

  public registerService<T extends ServiceBase>(service: T): UninitializedServiceRegistry<ContextType> {
      this.servicesInternal.set(service.constructor.name, service);
      return this;
  }
  public getService<T extends ServiceBase>(serviceType: new (...args: any[]) => T): T {
    const service =  this.servicesInternal.get(serviceType.name) as T;
    if (!service) {
        throw new Error(`Service ${serviceType.name} not found`);
    }
    return service;
  }

  public static initializeServices<ContextType>(serviceRegister: (serviceRegistry: UninitializedServiceRegistry<ContextType>) => void) : AddHandler<ContextType> {
    const newInstance = new Cellix<ContextType>();
      serviceRegister(newInstance);
      return newInstance;
  }
  
  public async setContext(contextCreator: (serviceRegistry: InitializedServiceRegistry) => ContextType): Promise<void> { 
    const self = await this.StartServices()
    this.contextInternal = contextCreator(self);
  }

  public registerAzureFunctionHandler(name: string, options: Omit<HttpFunctionOptions, "handler">, handlerCreator: (context: ContextType) => HttpHandler): AddHandler<ContextType> {
    app.http(name, {
        ...options,
        handler: (request, context) => {
            return handlerCreator(this.context)(request, context);
        }
    });
    return this;
  }

  private get context(): ContextType {
      return this.contextInternal;
  }
  
  private async StartServices(): Promise<InitializedServiceRegistry> {
    return new Promise((resolve, reject) => {
      app.hook.appStart((context: AppStartContext) => {
        const emptyRootContext = api.trace.setSpan(api.context.active(), api.trace.wrapSpanContext(undefined));
        
        api.context.with(emptyRootContext, async () => {

         
          this.tracer.startActiveSpan("azure-function.appStart", async (span) => {
          
              try {
                  //this should be done in parallel rather than sequential
                  for await (const [key, service] of this.servicesInternal.entries()) {
                    await this.tracer.startActiveSpan(`Service ${key} starting`, async (serviceSpan) => {
                      try {
                        console.log(`StartService: Service ${key} starting`);
                        await service.startUp();    
                        serviceSpan.setStatus({ code: SpanStatusCode.OK, message: `Service ${key} started`});              
                        console.log(`StartService: Service ${key} started`);
                      }
                      catch(err) {
                        serviceSpan.setStatus({ code: SpanStatusCode.ERROR });
                        serviceSpan.recordException(err);
                        throw err;
                      }finally {
                        serviceSpan.end();
                      }
                    });
                  };
                  span.setStatus({code: SpanStatusCode.OK, message: `azure-function.appStart: Started`});
                
                  console.log('Cellix started');
                  resolve(this);
                }catch(err) {
                  span.setStatus({ code: SpanStatusCode.ERROR });
                  span.recordException(err);
                  reject(err);
                  throw err;
                }finally {
                  span.end();
              }
          });            
        });
      });

      app.hook.appTerminate((context: AppTerminateContext) => {
          this.servicesInternal.forEach((service) => {
              service.shutDown();
          });
          console.log('Cellix stopped');
      });
    });
  }
}
