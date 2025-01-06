export interface StartupObject {
    name?: string;
    startupDate?: Date;
    shutdownDate?: Date;
    ShutDown(): void;
    StartUp(): void;
}