import { DomainEvent } from './domain-event';
export interface HandleEvent<T> {
    handle(event: T): void;
}
export declare class HandleEventImpl<T extends DomainEvent> implements HandleEvent<T> {
    private eventHandler;
    constructor(eventHandler: (event: T) => void);
    static register<T extends DomainEvent>(eventHandler: (event: T) => void): HandleEvent<T>;
    registerAll(eventHandlers: HandleEvent<T>[]): HandleEvent<T>;
    handle(event: T): void;
}
