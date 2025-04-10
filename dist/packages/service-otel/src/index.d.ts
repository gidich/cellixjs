import type { SyncServiceBase } from "api-services-spec";
export interface OtelContext {
}
export interface OtelConfig {
    exportToConsole?: boolean;
}
export declare class ServiceOtel implements SyncServiceBase<void> {
    private readonly sdk;
    constructor(config: OtelConfig);
    StartUp(): Promise<void>;
    ShutDown(): Promise<void>;
}
