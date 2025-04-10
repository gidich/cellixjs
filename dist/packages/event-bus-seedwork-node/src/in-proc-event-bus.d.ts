import { DomainSeedwork } from 'cellix-domain-seedwork';
declare class InProcEventBusImpl implements DomainSeedwork.EventBus {
    private eventSubscribers;
    private static instance;
    dispatch<T extends DomainSeedwork.DomainEvent>(event: new (...args: any) => T, data: any): Promise<void>;
    register<EventProps, T extends DomainSeedwork.CustomDomainEvent<EventProps>>(event: new (...args: any) => T, func: (payload: T['payload']) => Promise<void>): void;
    static getInstance(): InProcEventBusImpl;
}
export declare const InProcEventBusInstance: InProcEventBusImpl;
export {};
