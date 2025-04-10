import { EventBus } from './event-bus';
export interface PublishEvent<T> {
    publish(eventToPublish: new (...args: any) => any, data: any): any;
}
export declare class EventPublisher implements PublishEvent<any> {
    private eventBus;
    constructor(eventBus: EventBus);
    publish<DomainEvent>(eventToPublish: new (...args: any) => any, data: any): void;
}
