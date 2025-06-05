export interface ServiceBase<T = any> { 
    startUp(): Promise<Exclude<T,ServiceBase>>;
    shutDown(): Promise<void>;
}

export interface SyncServiceBase<T = any> { 
  startUp(): Exclude<T,ServiceBase>;
  shutDown(): void;
}