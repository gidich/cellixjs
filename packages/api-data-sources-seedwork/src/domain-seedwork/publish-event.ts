import { EventBus } from './event-bus';

export interface PublishEvent<T> {
  publish(eventToPublish: new (...args:any) => any, data: any);
}

export class EventPublisher implements PublishEvent<any> {
  constructor(private eventBus: EventBus) {}

  publish<DomainEvent>(eventToPublish: new (...args:any) => any, data: any) {
    this.eventBus.dispatch(eventToPublish, data);
  }
}
