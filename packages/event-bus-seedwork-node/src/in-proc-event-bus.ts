import { DomainSeedwork } from 'api-data-sources-seedwork';
class InProcEventBusImpl implements DomainSeedwork.EventBus {
  private eventSubscribers: { [eventType: string]: Array<(rawpayload: string) => Promise<void>> } = {};
  private static instance: InProcEventBusImpl;

  async dispatch<T extends DomainSeedwork.DomainEvent>(event: new (...args: any) => T, data: any): Promise<void> {
    console.log(`Dispatching in-proc event ${event.constructor.name} with data ${JSON.stringify(data)}`);
    if (this.eventSubscribers[event.constructor.name]) {
      for await (const subscriber of this.eventSubscribers[event.constructor.name]) {
        await subscriber(JSON.stringify(data));
      }
    }
  }

  register<EventProps, T extends DomainSeedwork.CustomDomainEvent<EventProps>>(event: new (...args: any) => T, func: (payload: T['payload']) => Promise<void>): void {
    console.log(`Registering in-proc event handler for: ${event.name}`);
    if (!this.eventSubscribers[event.name]) {
      this.eventSubscribers[event.name] = [];
    }
    this.eventSubscribers[event.name].push(async (rawpayload: string) => {
      console.log(`Received in-proc event ${event.name} with data ${rawpayload}`);
      await func(JSON.parse(rawpayload));
    });
  }

  public static getInstance(): InProcEventBusImpl {
    if (!this.instance) {
      this.instance = new this();
    }
    return this.instance;
  }
}

export const InProcEventBusInstance = InProcEventBusImpl.getInstance();
