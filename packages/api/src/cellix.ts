
import { app, AppStartContext, AppTerminateContext, HttpFunctionOptions, HttpHandler } from '@azure/functions';
import type { ServiceBase } from 'api-services-spec';
import api, { trace,TimeInput, SpanStatusCode } from '@opentelemetry/api';
import { SemanticAttributes } from "@opentelemetry/semantic-conventions";


export interface InitializedServiceRegistry {
    GetService<T extends ServiceBase>(serviceType: new (...args: any[]) => T): T ;
}

export class Cellix <ContextType>  implements InitializedServiceRegistry {
    private _context: ContextType;
    //typescript dictionary of services including each services type and service instance
    private readonly _services = new Map<string, ServiceBase>();
    public RegisterService<T extends ServiceBase>(service: T): this {
        this._services.set(service.constructor.name, service);
        return this;
    }
    public GetService<T extends ServiceBase>(serviceType: new (...args: any[]) => T): T {
        return this._services.get(serviceType.name) as T;
    }

    public RegisterAzureFunctionHandler(name: string, options: Omit<HttpFunctionOptions, "handler">, handlerCreator: (context: ContextType) => HttpHandler): this {
        app.http(name, {
            ...options,
            handler: (request, context) => {
                return handlerCreator(this.context)(request, context);
            }
        });
        return this;
    }
  
    public SetContext(contextCreator: (serviceRegistry: InitializedServiceRegistry) => ContextType):this  {
        this._context = contextCreator(this);
        return this;
    }
    public get context(): ContextType {
        return this._context;
    }
    
    public StartServer(): void {
        

        app.hook.appStart((context: AppStartContext) => {
            // startupObj = new startupObject();
            const tracer = trace.getTracer("cellix:data-access");
            tracer.startActiveSpan("azure-function.appStart", async (span) => {
                try {
                    this._services.forEach((service) => {
                        service.StartUp();
                    });
                    span.setStatus({code: SpanStatusCode.OK, message: `azure-function.appStart: Started`});
                    console.log('Cellix started');
                  }catch(err) {
                    span.setStatus({ code: SpanStatusCode.ERROR });
                    span.recordException(err);
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

    }
}




