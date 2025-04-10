import { HttpFunctionOptions, HttpHandler } from '@azure/functions';
import type { ServiceBase, SyncServiceBase } from 'api-services-spec';
export interface UninitializedServiceRegistry<ContextType = any> {
    registerService<T extends ServiceBase>(service: T): UninitializedServiceRegistry<ContextType>;
}
export interface InitializedServiceRegistry {
    getService<T extends ServiceBase>(serviceType: new (...args: any[]) => T): T;
}
export interface RegisterAndInitalizeServices<ContextType = any> {
    initializeServices(serviceRegister: (serviceRegistry: UninitializedServiceRegistry<ContextType>) => void): AddHandler<ContextType>;
}
export interface AddHandler<ContextType = any> {
    registerAzureFunctionHandler(name: string, options: Omit<HttpFunctionOptions, "handler">, handlerCreator: (context: ContextType) => HttpHandler): AddHandler<ContextType>;
    setContext(contextCreator: (serviceRegistry: InitializedServiceRegistry) => ContextType): Promise<void>;
}
export declare class Cellix<ContextType> implements UninitializedServiceRegistry, InitializedServiceRegistry, RegisterAndInitalizeServices, AddHandler {
    private contextInternal;
    private readonly tracer;
    private readonly servicesInternal;
    private loggingService;
    private constructor();
    static registerAndStartLoggingService<ContextType, T extends SyncServiceBase>(service: T): RegisterAndInitalizeServices<ContextType>;
    registerService<T extends ServiceBase>(service: T): UninitializedServiceRegistry<ContextType>;
    getService<T extends ServiceBase>(serviceType: new (...args: any[]) => T): T;
    initializeServices(serviceRegister: (serviceRegistry: UninitializedServiceRegistry<ContextType>) => void): AddHandler<ContextType>;
    setContext(contextCreator: (serviceRegistry: InitializedServiceRegistry) => ContextType): Promise<void>;
    registerAzureFunctionHandler(name: string, options: Omit<HttpFunctionOptions, "handler">, handlerCreator: (context: ContextType) => HttpHandler): AddHandler<ContextType>;
    private get context();
    private StartServices;
}
