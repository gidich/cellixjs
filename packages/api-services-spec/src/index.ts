export interface ServiceBase<T = any> { 
    StartUp(): Promise<Exclude<T,ServiceBase>>;
    ShutDown(): Promise<void>;
}