export interface ServiceBase<T = any> {
    StartUp(): Promise<Exclude<T, ServiceBase>>;
    ShutDown(): Promise<void>;
}
export interface SyncServiceBase<T = any> {
    StartUp(): Exclude<T, ServiceBase>;
    ShutDown(): void;
}
