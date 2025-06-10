import { type EventBus } from './event-bus.ts';

export interface PublishEvent {
  publish(eventToPublish: new (...args:any) => any, data: any): void;
}

export class EventPublisher implements PublishEvent {
  private eventBus: EventBus;

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
  }

  publish(eventToPublish: new (...args:any) => any, data: any) {
    this.eventBus.dispatch(eventToPublish, data);
  }
}
