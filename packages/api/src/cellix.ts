import {
	app,
	type HttpFunctionOptions,
	type HttpHandler,
} from '@azure/functions';
import type { ServiceBase } from '@cellix/api-services-spec';
import api, { trace, SpanStatusCode, type Tracer } from '@opentelemetry/api';

// -----------------------------
// Phase Interfaces
// -----------------------------
export interface InfrastructureServiceRegistry<ContextType = unknown, AppServices = unknown> {
	registerInfrastructureService<T extends ServiceBase>(service: T): InfrastructureServiceRegistry<ContextType, AppServices>;
}

export interface ContextBuilder<ContextType = unknown, AppServices = unknown> {
	setContext(
		contextCreator: (serviceRegistry: InitializedServiceRegistry) => ContextType,
	): ApplicationServicesInitializer<ContextType, AppServices>;
}

export interface ApplicationServicesInitializer<ContextType, AppServices = unknown> {
	initializeApplicationServices(
		factory: (infrastructureContext: ContextType) => AppHost<AppServices>
	): AzureFunctionHandlerRegistry<ContextType, AppServices>;
}

export interface AzureFunctionHandlerRegistry<ContextType = unknown, AppServices = unknown> {
	registerAzureFunctionHttpHandler(
		name: string,
		options: Omit<HttpFunctionOptions, 'handler'>,
		handlerCreator: (
			applicationServicesHost: AppHost<AppServices>,
		) => HttpHandler,
	): AzureFunctionHandlerRegistry<ContextType, AppServices>;
	startUp(): Promise<StartedApplication<ContextType>>;
}

export interface StartedApplication<ContextType = unknown>
	extends InitializedServiceRegistry {
	get context(): ContextType;
}

export interface InitializedServiceRegistry {
	getInfrastructureService<T extends ServiceBase>(serviceType: { name: string }): T;
	get servicesInitialized(): boolean;
}

// Backward compatibility alias (legacy naming)
export type UninitializedServiceRegistry<ContextType = unknown, AppServices = unknown> = InfrastructureServiceRegistry<ContextType, AppServices>;


type RequestScopedHost<S, H = unknown> = {
  forRequest(rawAuthHeader?: string, hints?: H): Promise<S>;
  // optional future: forSystem?: (opts?: unknown) => Promise<S>;
};

export type AppHost<AppServices> = RequestScopedHost<AppServices, unknown>;

interface PendingHandler<AppServices> {
	name: string;
	options: Omit<HttpFunctionOptions, 'handler'>;
	handlerCreator: (applicationServicesHost: AppHost<AppServices>) => HttpHandler;
}

type Phase = 'infrastructure' | 'context' | 'app-services' | 'handlers' | 'started';

export class Cellix<ContextType, AppServices = unknown>
	implements
		InfrastructureServiceRegistry<ContextType, AppServices>,
		ContextBuilder<ContextType, AppServices>,
		ApplicationServicesInitializer<ContextType, AppServices>,
		AzureFunctionHandlerRegistry<ContextType, AppServices>,
		StartedApplication<ContextType>
{
	private contextInternal: ContextType | undefined;
	private appServicesHostInternal: RequestScopedHost<AppServices, unknown> | undefined;
	private contextCreatorInternal: ((serviceRegistry: InitializedServiceRegistry) => ContextType) | undefined;
	private appServicesHostBuilder: ((infrastructureContext: ContextType) => RequestScopedHost<AppServices, unknown>) | undefined;
	private readonly tracer: Tracer;
	private readonly servicesInternal: Map<string, ServiceBase> = new Map();
	private readonly pendingHandlers: Array<PendingHandler<AppServices>> = [];
	private serviceInitializedInternal = false;
	private phase: Phase = 'infrastructure';

	private constructor() {
		this.tracer = trace.getTracer('cellix:bootstrap');
	}

	// Entry (Phase 1) with constrained registry exposure
	public static initializeInfrastructureServices<ContextType, AppServices = unknown>(
		registrar: (
			registry: UninitializedServiceRegistry<ContextType, AppServices>,
		) => void,
	): ContextBuilder<ContextType, AppServices> {
		const instance = new Cellix<ContextType, AppServices>();
		registrar(instance);
		return instance;
	}

	public registerInfrastructureService<T extends ServiceBase>(service: T): InfrastructureServiceRegistry<ContextType, AppServices> {
		this.ensurePhase('infrastructure');
        const serviceName = service.constructor.name;
        if (this.servicesInternal.has(serviceName)) {
            throw new Error(`Service ${serviceName} already registered`);
        }
		this.servicesInternal.set(serviceName, service);
		return this;
	}

	// Phase 2
	public setContext(contextCreator: (serviceRegistry: InitializedServiceRegistry) => ContextType): ApplicationServicesInitializer<ContextType, AppServices> {
		this.ensurePhase('infrastructure');
		this.contextCreatorInternal = contextCreator;
		this.phase = 'context';
		return this;
	}

	// Phase 3
	public initializeApplicationServices(
		factory: (infrastructureContext: ContextType) => RequestScopedHost<AppServices, unknown>,
	): AzureFunctionHandlerRegistry<ContextType, AppServices> {
		this.ensurePhase('context');
		if (!this.contextCreatorInternal) {
			throw new Error('Context creator must be set before initializing application services');
		}
		this.appServicesHostBuilder = factory;
		this.phase = 'app-services';
		return this;
	}

	// Phase 4
	public registerAzureFunctionHttpHandler(
		name: string,
		options: Omit<HttpFunctionOptions, 'handler'>,
		handlerCreator: (
			applicationServicesHost: RequestScopedHost<AppServices, unknown>,
		) => HttpHandler,
	): AzureFunctionHandlerRegistry<ContextType, AppServices> {
		this.ensurePhase('app-services', 'handlers');
		this.pendingHandlers.push({ name, options, handlerCreator });
		this.phase = 'handlers';
		return this;
	}

	// Phase 5 - Execute recipe
	public startUp(): Promise<StartedApplication<ContextType>> {
		this.ensurePhase('handlers', 'app-services');
		if (!this.contextCreatorInternal) {
			throw new Error('Context not configured. Call setContext() first.');
		}
		this.setupLifecycle();
		this.phase = 'started';
		return Promise.resolve(this);
	}

	private setupLifecycle(): void {
		// Register function handlers (deferred execution of creators)
		for (const h of this.pendingHandlers) {
			app.http(h.name, {
				...h.options,
				handler: (request, context) => {
					if (!this.appServicesHostInternal) {
						throw new Error('Application not started yet');
					}
					return h.handlerCreator(this.appServicesHostInternal)(request, context);
				},
			});
		}

		// appStart hook
		app.hook.appStart(async () => {
			const root = api.context.active();
			await api.context.with(root, async () => {
				await this.tracer.startActiveSpan('cellix.appStart', async (span) => {
					try {
						await this.startAllServicesWithTracing();
						this.serviceInitializedInternal = true;
						if (!this.contextCreatorInternal) {
							throw new Error('Context creator missing at appStart');
						}
						this.contextInternal = this.contextCreatorInternal(this);
						if (!this.appServicesHostBuilder) {
							throw new Error('Application services factory not provided. Call initializeApplicationServices().');
						}
						this.appServicesHostInternal = this.appServicesHostBuilder(this.contextInternal);
						span.setStatus({ code: SpanStatusCode.OK });
						console.log('Cellix started');
					} catch (err) {
						span.setStatus({ code: SpanStatusCode.ERROR });
						if (err instanceof Error) {
							span.recordException(err);
						}
						throw err;
					} finally {
						span.end();
					}
				});
			});
		});

		// appTerminate hook
		app.hook.appTerminate(async () => {
			const root = api.context.active();
			await api.context.with(root, async () => {
				await this.tracer.startActiveSpan('cellix.appTerminate', async (span) => {
					try {
						await this.stopAllServicesWithTracing();
						span.setStatus({ code: SpanStatusCode.OK });
						console.log('Cellix stopped');
					} catch (err) {
						span.setStatus({ code: SpanStatusCode.ERROR });
						if (err instanceof Error) {
							span.recordException(err);
						}
						throw err;
					} finally {
						span.end();
					}
				});
			});
		});
	}

	private ensurePhase(...allowed: Phase[]): void {
		if (!allowed.includes(this.phase)) {
			throw new Error(`Invalid operation in phase '${this.phase}'. Allowed phases: ${allowed.join(', ')}`);
		}
	}

	// Registry accessors
	public getInfrastructureService<T extends ServiceBase>(serviceType: { name: string }): T {
		const service = this.servicesInternal.get(serviceType.name);
		if (!service) {
			throw new Error(`Service ${serviceType.name} not found`);
		}
		return service as T;
	}

	public get servicesInitialized(): boolean {
		return this.serviceInitializedInternal;
	}

	public get context(): ContextType {
		if (!this.contextInternal) {
			throw new Error('Context not initialized');
		}
		return this.contextInternal;
	}

	public get applicationServices(): RequestScopedHost<AppServices, unknown> {
		if (!this.appServicesHostInternal) {
			throw new Error('Application services not initialized');
		}
		return this.appServicesHostInternal;
	}

	// Service lifecycle helpers
	private async startAllServicesWithTracing(): Promise<void> {
		await this.iterateServicesWithTracing('start', 'startUp');
	}
	private async stopAllServicesWithTracing(): Promise<void> {
		await this.iterateServicesWithTracing('stop', 'shutDown');
	}
	private async iterateServicesWithTracing(operationName: 'start' | 'stop', serviceMethod: 'startUp' | 'shutDown'): Promise<void> {
		const operationFullName = `${operationName.charAt(0).toUpperCase() + operationName.slice(1)}Service`;
		const operationActionPending = operationName === 'start' ? 'starting' : 'stopping';
		const operationActionCompleted = operationName === 'start' ? 'started' : 'stopped';
		await Promise.all(
			Array.from(this.servicesInternal.entries()).map(([key, service]) =>
				this.tracer.startActiveSpan(`Service ${key} ${operationName}`, async (span) => {
					try {
						console.log(`${operationFullName}: Service ${key} ${operationActionPending}`);
						await service[serviceMethod]();
						span.setStatus({ code: SpanStatusCode.OK, message: `Service ${key} ${operationActionCompleted}` });
						console.log(`${operationFullName}: Service ${key} ${operationActionCompleted}`);
					} catch (err) {
						span.setStatus({ code: SpanStatusCode.ERROR });
						if (err instanceof Error) {
							span.recordException(err);
						}
						throw err;
					} finally {
						span.end();
					}
				}),
			),
		);
	}
}
