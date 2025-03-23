
import { app, AppStartContext, AppTerminateContext, HttpFunctionOptions, HttpHandler } from '@azure/functions';
import type { ServiceBase } from 'api-services-spec';
import api, { trace,TimeInput, SpanStatusCode } from '@opentelemetry/api';
import { SemanticAttributes } from "@opentelemetry/semantic-conventions";



export interface UninitializedServiceRegistry<ContextType = any>  {
  RegisterService<T extends ServiceBase>(service: T): UninitializedServiceRegistry<ContextType>;
}
export interface InitializedServiceRegistry  {
  GetService<T extends ServiceBase>(serviceType: new (...args: any[]) => T): T ;
}


export interface RegisterAndInitalizeServices<ContextType = any> {
  InitializeServices(serviceRegister: (serviceRegistry: UninitializedServiceRegistry<ContextType>) => void) : AddHandler<ContextType>;
}

/*
export interface AddContext<ContextType = any>  {
  SetContext(contextCreator: (serviceRegistry: InitializedServiceRegistry) => ContextType): Promise<void>;
}
  */
export interface AddHandler<ContextType = any> {
  RegisterAzureFunctionHandler(name: string, options: Omit<HttpFunctionOptions, "handler">, handlerCreator: (context: ContextType) => HttpHandler): AddHandler<ContextType>;
  SetContext(contextCreator: (serviceRegistry: InitializedServiceRegistry) => ContextType): Promise<void>;

}


  

export class Cellix <ContextType>  implements UninitializedServiceRegistry, InitializedServiceRegistry,RegisterAndInitalizeServices, AddHandler {
    private _context: ContextType;
    //typescript dictionary of services including each services type and service instance
    private readonly _services:Map<string, ServiceBase> = new Map<string, ServiceBase>();


    private constructor() {
    }
    public static Create<ContextType>(): RegisterAndInitalizeServices<ContextType> {
        return new Cellix<ContextType>();
    }

    public RegisterService<T extends ServiceBase>(service: T): UninitializedServiceRegistry<ContextType> {
        this._services.set(service.constructor.name, service);
        return this;
    }
    public GetService<T extends ServiceBase>(serviceType: new (...args: any[]) => T): T {
      const service =  this._services.get(serviceType.name) as T;
      if (!service) {
          throw new Error(`Service ${serviceType.name} not found`);
      }
      return service;
    }



    public InitializeServices(serviceRegister: (serviceRegistry: UninitializedServiceRegistry<ContextType>) => void) : AddHandler<ContextType> {
        serviceRegister(this);
        return this;
    }
    
    public async SetContext(contextCreator: (serviceRegistry: InitializedServiceRegistry) => ContextType): Promise<void> { 
      const self = await this.StartServices()
      this._context = contextCreator(self);
    //  this._context = contextCreator(this);
     // return this;
    }

    public RegisterAzureFunctionHandler(name: string, options: Omit<HttpFunctionOptions, "handler">, handlerCreator: (context: ContextType) => HttpHandler): AddHandler<ContextType> {
      app.http(name, {
          ...options,
          handler: (request, context) => {
              return handlerCreator(this.context)(request, context);
          }
      });
      return this;
  }




  
    private get context(): ContextType {
        return this._context;
    }
    
    private async StartServices(): Promise<InitializedServiceRegistry> {
      //promise returning self after starting services
      return new Promise((resolve, reject) => {
        app.hook.appStart((context: AppStartContext) => {
            const tracer = trace.getTracer("cellix:data-access");
            tracer.startActiveSpan("azure-function.appStart", async (span) => {
                try {
                    for await (const [key, service] of this._services.entries()) {
                      console.log(`StartService: Service ${key} starting`);
                      await service.StartUp();
                      console.log(`StartService: Service ${key} started`);
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

        app.hook.appTerminate((context: AppTerminateContext) => {
            this._services.forEach((service) => {
                service.ShutDown();
            });
            console.log('Cellix stopped');
        });
      });
    }
}




