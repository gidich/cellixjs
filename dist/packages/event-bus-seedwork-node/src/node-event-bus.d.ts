import { DomainSeedwork } from 'cellix-domain-seedwork';
declare class NodeEventBusImpl implements DomainSeedwork.EventBus {
    private static instance;
    private broadcaster;
    private constructor();
    removeAllListeners(): void;
    dispatch<T extends DomainSeedwork.DomainEvent>(event: new (...args: any) => T, data: any): Promise<void>;
    register<EventProps, T extends DomainSeedwork.CustomDomainEvent<EventProps>>(event: new (...args: any) => T, func: (payload: T['payload']) => Promise<void>): void;
    static getInstance(): NodeEventBusImpl;
}
export declare const NodeEventBusInstance: NodeEventBusImpl;
export {};
