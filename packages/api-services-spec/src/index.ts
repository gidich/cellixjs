export interface ServiceBase { 
    StartUp(): Promise<void>;
    ShutDown(): Promise<void>;
}