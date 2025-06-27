import {
	app,
	type HttpFunctionOptions,
	type HttpHandler,
} from '@azure/functions';
import type { ServiceBase } from '@cellix/api-services-spec';
import api, { trace, SpanStatusCode, type Tracer } from '@opentelemetry/api';

export interface UninitializedServiceRegistry<ContextType = unknown> {
	registerService<T extends ServiceBase>(
		service: T,
	): UninitializedServiceRegistry<ContextType>;
}

export interface InitializedServiceRegistry {
	getService<T extends ServiceBase>(serviceType: { name: string }): T;
	get servicesInitialized(): boolean;
}

export interface AddHandler<ContextType = unknown> {
	registerAzureFunctionHandler(
		name: string,
		options: Omit<HttpFunctionOptions, 'handler'>,
		handlerCreator: (context: ContextType) => HttpHandler,
	): AddHandler<ContextType>;
	setContext(
		contextCreator: (
			serviceRegistry: InitializedServiceRegistry,
		) => ContextType,
	): Promise<AddHandler<ContextType>>;
}

export class Cellix<ContextType>
	implements
		UninitializedServiceRegistry,
		InitializedServiceRegistry,
		AddHandler
{
	private contextInternal: ContextType | undefined;
	private readonly tracer: Tracer;
	//typescript dictionary of services including each services type and service instance
	private readonly servicesInternal: Map<string, ServiceBase> = new Map<
		string,
		ServiceBase
	>();
	private serviceInitializedInternal: boolean = false;

	private constructor() {
		this.tracer = trace.getTracer('cellix:data-access');
	}

	public registerService<T extends ServiceBase>(
		service: T,
	): UninitializedServiceRegistry<ContextType> {
		this.servicesInternal.set(service.constructor.name, service);
		return this;
	}
	public getService<T extends ServiceBase>(serviceType: { name: string }): T {
		const service = this.servicesInternal.get(serviceType.name);
		if (!service) {
			throw new Error(`Service ${serviceType.name} not found`);
		}
		return service as T;
	}

	public static initializeServices<ContextType>(
		serviceRegister: (
			serviceRegistry: UninitializedServiceRegistry<ContextType>,
		) => void,
	): AddHandler<ContextType> {
		const newInstance = new Cellix<ContextType>();
		serviceRegister(newInstance);
		return newInstance;
	}

	private get context(): ContextType | undefined {
		if (!this.contextInternal) {
			throw new Error(
				'Context not set. Please call setContext before accessing the context.',
			);
		}
		return this.contextInternal;
	}

	public get servicesInitialized(): boolean {
		return this.serviceInitializedInternal;
	}

	public registerAzureFunctionHandler(
		name: string,
		options: Omit<HttpFunctionOptions, 'handler'>,
		handlerCreator: (context: ContextType) => HttpHandler,
	): AddHandler<ContextType> {
		app.http(name, {
			...options,
			handler: (request, context) => {
				if (!this.context) {
					throw new Error(
						'Services not initialized. Please call setContext before registering handlers.',
					);
				}
				return handlerCreator(this.context)(request, context);
			},
		});
		return this;
	}

	public setContext(
		contextCreator: (
			serviceRegistry: InitializedServiceRegistry,
		) => ContextType,
	): Promise<AddHandler<ContextType>> {
		console.log('registering appStart hook');
		app.hook.appStart(async () => {
			//context: AppStartContext
			const emptyRootContext = api.context.active(); // api.trace.setSpan(api.context.active(), api.trace.wrapSpanContext(undefined)); -- doesn't like undefined
			await api.context.with(emptyRootContext, async () => {
				await this.tracer.startActiveSpan(
					'azure-function.appStart',
					async (span) => {
						try {
							await this.startAllServicesWithTracing();
							span.setStatus({
								code: SpanStatusCode.OK,
								message: `azure-function.appStart: Started`,
							});
							this.serviceInitializedInternal = true;
							console.log('Cellix started');
							this.contextInternal = contextCreator(this); // Set the context using the provided contextCreator function
						} catch (err) {
							span.setStatus({ code: SpanStatusCode.ERROR });
							if (err instanceof Error) {
								span.recordException(err);
							}
							throw err;
						} finally {
							span.end();
						}
					},
				);
			});
		});
		console.log('Cellix appStart hook registered');
		app.hook.appTerminate(async () => {
			const rootContext = api.context.active();
			await api.context.with(rootContext, async () => {
				await this.tracer.startActiveSpan(
					'azure-function.appTerminate',
					async (span) => {
						try {
							await this.stopAllServicesWithTracing();
							span.setStatus({
								code: SpanStatusCode.OK,
								message: `azure-function.appTerminate: Stopped`,
							});
							console.log('Cellix stopped');
						} catch (err) {
							span.setStatus({ code: SpanStatusCode.ERROR });
							if (err instanceof Error) {
								span.recordException(err);
							}
							throw err;
						}
					},
				);
			});
			console.log('Cellix stopped');
		});
		console.log('Cellix appTerminate hook registered');
		return Promise.resolve(this);
	}

	private async startAllServicesWithTracing(): Promise<void> {
		await this.iterateServicesWithTracing('start', 'startUp');
	}

	private async stopAllServicesWithTracing(): Promise<void> {
		await this.iterateServicesWithTracing('stop', 'shutDown');
	}

	private async iterateServicesWithTracing(
		operationName: 'start' | 'stop',
		serviceMethod: 'startUp' | 'shutDown',
	): Promise<void> {
		const operationFullName = `${operationName.charAt(0).toUpperCase() + operationName.slice(1)}Service`;
		const operationActionPending =
			operationName === 'start' ? 'starting' : 'stopping';
		const operationActionCompleted =
			operationName === 'start' ? 'started' : 'stopped';
		await Promise.all(
			Array.from(this.servicesInternal.entries()).map(([key, service]) =>
				this.tracer.startActiveSpan(
					`Service ${key} ${operationName}`,
					async (span) => {
						try {
							console.log(
								`${operationFullName}: Service ${key} ${operationActionPending}`,
							);
							await service[serviceMethod]();
							span.setStatus({
								code: SpanStatusCode.OK,
								message: `Service ${key} ${operationActionCompleted}`,
							});
							console.log(
								`${operationFullName}: Service ${key} ${operationActionCompleted}`,
							);
						} catch (err) {
							span.setStatus({ code: SpanStatusCode.ERROR });
							if (err instanceof Error) {
								span.recordException(err);
							}
							throw err;
						} finally {
							span.end();
						}
					},
				),
			),
		);
	}
}
