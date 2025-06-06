import EventEmitter from 'events';
import { performance } from 'perf_hooks';
import { DomainSeedwork } from '@cellix/domain-seedwork';
import api, { trace,type TimeInput, SpanStatusCode } from '@opentelemetry/api';
import { SEMATTRS_DB_SYSTEM, SEMATTRS_DB_NAME, SEMATTRS_DB_STATEMENT } from '@opentelemetry/semantic-conventions';


class BroadCaster {
  private eventEmitter: EventEmitter;

  constructor() {
    this.eventEmitter = new EventEmitter();
  }

  public broadcast(event: string, data: any) {
    this.eventEmitter.emit(event, data);
  }

  public on(event: string, listener: any) {
    this.eventEmitter.on(event, listener);
  }

  public removeAllListeners() {
    this.eventEmitter.removeAllListeners();
    console.log('All listeners removed');
  }
}

interface RawPayload {
  data: string;
  context: any; // Or a more specific type if known
}

class NodeEventBusImpl implements DomainSeedwork.EventBus {
  private static instance: NodeEventBusImpl;
  private broadcaster: BroadCaster;

  private constructor() {
    this.broadcaster = new BroadCaster();
  }

  removeAllListeners() {
    this.broadcaster.removeAllListeners();
  }

  async dispatch<T extends DomainSeedwork.DomainEvent>(event: new (...args: any) => T, data: any): Promise<void> {
    console.log(`Dispatching node event (${event.constructor.name} or ${event.name}) with data ${JSON.stringify(data)}`);

    let contextObject = {};
    api.propagation.inject(api.context.active(), contextObject);

    // console.log(`Trace context: ${JSON.stringify(contextObject)}`);
    const tracer = trace.getTracer('PG:data-access');
    tracer.startActiveSpan('node-event-bus.publish', async (span) => {
      span.setAttribute('message.system', 'node-event-bus');
      span.setAttribute('messaging.operation', 'publish');
      span.setAttribute('messaging.destination.name', event.constructor.name);
      span.addEvent('dispatching node event', { name: event.constructor.name, data: JSON.stringify(data) }, new Date());

      try {
        this.broadcaster.broadcast(event.constructor.name, { data: JSON.stringify(data), context: contextObject });
        span.setStatus({ code: SpanStatusCode.OK, message: `NodeEventBus: Executed ${event.name}` });
      } catch (err) {
        span.setStatus({ code: SpanStatusCode.ERROR });
        span.recordException(err as Error);
      } finally {
        span.end();
      }
    });
  }

  register<EventProps, T extends DomainSeedwork.CustomDomainEvent<EventProps>>(event: new (...args: any) => T, func: (payload: T['payload']) => Promise<void>): void {
    console.log(`custom-log | registering-node-event-handler | ${event.name}`);

    this.broadcaster.on(event.name, async (rawPayload: RawPayload) => {
      console.log(`Received node event ${event.name} with data ${JSON.stringify(rawPayload)}`);
      const activeContext = api.propagation.extract(api.context.active(), rawPayload.context);
      api.context.with(activeContext, async () => {
        // all descendants of this context will have the active context set
        const tracer = trace.getTracer('PG:data-access');
        tracer.startActiveSpan(`node-event-bus.process`, async (span) => {
          span.setAttribute('message.system', 'node-event-bus');
          span.setAttribute('messaging.operation', 'process');
          span.setAttribute('messaging.destination.name', event.name);

          span.setStatus({ code: SpanStatusCode.UNSET, message: `NodeEventBus: Executing ${event.name}` });
          span.setAttribute('data', rawPayload.data);

          // hack to create dependency title in App Insights to show up nicely in trace details
          // see : https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/monitor/monitor-opentelemetry-exporter/src/utils/spanUtils.ts#L191
          span.setAttribute(SEMATTRS_DB_SYSTEM, 'node-event-bus'); // hack (becomes upper case)
          span.setAttribute(SEMATTRS_DB_NAME, event.name); // hack
          span.setAttribute(SEMATTRS_DB_STATEMENT, `handling event: ${event.name} with payload: ${rawPayload.data}`); // hack - dumps payload in command

          span.addEvent(`NodeEventBus: Executing ${event.name}`, { data: rawPayload.data }, performance.now() as TimeInput);
          try {
            await func(JSON.parse(rawPayload['data']));
            span.setStatus({ code: SpanStatusCode.OK, message: `NodeEventBus: Executed ${event.name}` });
          } catch (e) {
            span.recordException(e as Error);
            span.setStatus({ code: SpanStatusCode.ERROR, message: `NodeEventBus: Error executing ${event.name}` });
            console.error(`Error handling node event ${event.name} with data ${rawPayload}`);
            console.error(e as Error);
          } finally {
            span.end();
          }
        });
      });
    });
  }

  public static getInstance(): NodeEventBusImpl {
    if (!this.instance) {
      this.instance = new this();
    }
    return this.instance;
  }
}

export const NodeEventBusInstance = NodeEventBusImpl.getInstance();
