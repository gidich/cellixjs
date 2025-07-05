import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NodeEventBusInstance } from './node-event-bus.ts';
import { DomainSeedwork } from '@cellix/domain-seedwork';

// --- Mocks for OpenTelemetry and performance ---
vi.mock('@opentelemetry/api', () => {
	const propagation = {
		inject: vi.fn(),
		extract: vi.fn(() => ({})),
	};
	const context = {
		active: vi.fn(),
		with: async (_context: unknown, fn: typeof Function) => await fn(),
	};
	return {
		default: {
			propagation,
			context,
		},
		trace: {
			getTracer: () => ({
				// biome-ignore lint:noBannedTypes
				startActiveSpan: async (_name: string, fn: Function) =>
					await fn({
						setAttribute: vi.fn(),
						addEvent: vi.fn(),
						setStatus: vi.fn(),
						end: vi.fn(),
						recordException: vi.fn(),
					}),
			}),
		},
		SpanStatusCode: { OK: 1, ERROR: 2, UNSET: 0 },
	};
});
vi.mock('node:perf_hooks', () => ({ performance: { now: () => 0 } }));

describe('NodeEventBusImpl', () => {
	// --- Initialization ---
	describe('Scenario: Initializing the NodeEventBusImpl', () => {
		describe('Given the NodeEventBusInstance singleton', () => {
			describe('When the instance has not been initialized', () => {
				it('Then it should initialize the event bus instance and return it', () => {
					//
					// Act
					const instance1 = NodeEventBusInstance;

					//
					// Assert
					expect(instance1).toBeDefined();
					expect(instance1).toBeInstanceOf(NodeEventBusInstance.constructor);
					expect(typeof NodeEventBusInstance.dispatch).toBe('function');
					expect(typeof NodeEventBusInstance.register).toBe('function');
                    expect(typeof NodeEventBusInstance.removeAllListeners).toBe('function');
				});
			});
			describe('When the instance has already been initialized', () => {
				it('Then it should return the same event bus instance', () => {
					//
					// Act
					const instance1 = NodeEventBusInstance;
					const instance2 = NodeEventBusInstance;

                    console.log(NodeEventBusInstance.constructor)
                    console.log(NodeEventBusInstance.constructor.name)

					//
					// Assert
                    expect(instance2).toBeInstanceOf(NodeEventBusInstance.constructor)
					expect(instance1).toBe(instance2);
				});
			});
		});
	});

	// --- Register ---
	describe('Scenario: Registering Integration Event Handlers', () => {
		class TestEvent extends DomainSeedwork.CustomDomainEventImpl<{
			test: string;
		}> {}
		let handler: (payload: { test: string }) => Promise<void>;
		const nodeEventBus = NodeEventBusInstance;

		beforeEach(() => {
			handler = vi.fn().mockResolvedValue(undefined);
			nodeEventBus.removeAllListeners();
		});

		describe('Given an initialized NodeEventBusImpl', () => {
			describe('When a handler is registered', () => {
				it('Then it should be called with the correct payload when the event is dispatched', async () => {
					//
					// Arrange
					nodeEventBus.register(TestEvent, handler);

					//
					// Act
					await nodeEventBus.dispatch(TestEvent, { test: 'data' });

					//
					// Assert
					expect(handler).toHaveBeenCalledWith({ test: 'data' });
				});
			});

			describe('When the same handler is registered multiple times for the same event', () => {
				it('Then it should be called multiple times when the event is dispatched', async () => {
					//
					// Arrange
					nodeEventBus.register(TestEvent, handler);
					nodeEventBus.register(TestEvent, handler);

					//
					// Act
					await nodeEventBus.dispatch(TestEvent, { test: 'data' });

					//
					// Assert
					expect(handler).toHaveBeenCalledTimes(2);
					expect(handler).toHaveBeenNthCalledWith(1, { test: 'data' });
					expect(handler).toHaveBeenNthCalledWith(2, { test: 'data' });
				});
			});

			describe('When handlers are registered for different event types', () => {
				class EventA extends DomainSeedwork.CustomDomainEventImpl<{
					a: string;
				}> {}
				class EventB extends DomainSeedwork.CustomDomainEventImpl<{
					b: string;
				}> {}
				let handlerA: (payload: { a: string }) => Promise<void>;
				let handlerB: (payload: { b: string }) => Promise<void>;

				beforeEach(() => {
					handlerA = vi.fn().mockResolvedValue(undefined);
					handlerB = vi.fn().mockResolvedValue(undefined);
					nodeEventBus.removeAllListeners();
				});

				it('Then only the correct handler is called for each event', async () => {
					//
					// Arrange
					nodeEventBus.register(EventA, handlerA);
					nodeEventBus.register(EventB, handlerB);

					//
					// Act
					await nodeEventBus.dispatch(EventA, { a: 'A' });
					await nodeEventBus.dispatch(EventB, { b: 'B' });

					//
					// Assert
					expect(handlerA).toHaveBeenCalledWith({ a: 'A' });
					expect(handlerB).toHaveBeenCalledWith({ b: 'B' });
					expect(handlerA).toHaveBeenCalledTimes(1);
					expect(handlerB).toHaveBeenCalledTimes(1);
				});
			});
		});
	});

	// --- Dispatch ---
	describe('Scenario: Dispatching Integration Events', () => {
		class TestEvent extends DomainSeedwork.CustomDomainEventImpl<{
			test: string;
		}> {}
		let handler: (payload: { test: string }) => Promise<void>;
		const nodeEventBus = NodeEventBusInstance;

		beforeEach(() => {
			handler = vi.fn().mockResolvedValue(undefined);
			nodeEventBus.removeAllListeners();
		});

		describe('Given a registered handler for an event', () => {
			describe('When the event is dispatched', () => {
				it('Then the handler should be called with the correct payload', async () => {
					//
					// Arrange
					nodeEventBus.register(TestEvent, handler);

					//
					// Act
					await nodeEventBus.dispatch(TestEvent, { test: 'data' });

					//
					// Assert
					expect(handler).toHaveBeenCalledWith({ test: 'data' });
				});
			});
			describe('When dispatch is called', () => {
				it('Then span.setStatus should be called with ERROR, recordException should be called, the span should be ended, and the error should NOT be propagated', async () => {
					//
					// Arrange
					class ErrorEvent extends DomainSeedwork.CustomDomainEventImpl<{
						test: string;
					}> {}
					nodeEventBus.removeAllListeners();

					// Patch broadcaster.broadcast to throw
					const error = new Error('broadcast failed');
					// @ts-expect-error: access private for test
					const originalBroadcast = nodeEventBus.broadcaster.broadcast;
					// @ts-expect-error: access private for test
					nodeEventBus.broadcaster.broadcast = vi.fn(() => {
						throw error;
					});

					// Use spies for the OpenTelemetry span methods (from the vi.mock at the top of the file)
					// These spies are already set up in the vi.mock at the top of the file
					// so we can access them via the span object passed to startActiveSpan
					// We'll use a local span object to capture calls
					const span = {
						setAttribute: vi.fn(),
						addEvent: vi.fn(),
						setStatus: vi.fn(),
						end: vi.fn(),
						recordException: vi.fn(),
					};
					// Patch the tracer to use our span
					const otel = await import('@opentelemetry/api');
                    vi.spyOn(otel.trace, 'getTracer').mockImplementation((_name?: string, ..._args: unknown[]) => ({
                        startActiveSpan: ((_name: string, ...rest: unknown[]) => {
                            // Find the function argument (could be 2nd, 3rd, or 4th param)
                            // biome-ignore lint:noBannedTypes
                            const fn = rest.find(arg => typeof arg === 'function') as Function;
                            return fn(span);
                        }),
                        startSpan: vi.fn(),
                    }));

					//
					// Act
					await expect(
						nodeEventBus.dispatch(ErrorEvent, { test: 'fail' }),
					).resolves.not.toThrow();

					//
					// Assert
					expect(span.setStatus).toHaveBeenCalledWith({ code: 2 }); // 2 === SpanStatusCode.ERROR
					expect(span.recordException).toHaveBeenCalledWith(error);
					expect(span.end).toHaveBeenCalled();

					// Restore the original broadcast method
					// @ts-expect-error: access private for test
					nodeEventBus.broadcaster.broadcast = originalBroadcast;
				});
			});
		});

		describe('Given multiple handlers for the same event', () => {
			let handler1: (payload: { test: string }) => Promise<void>;
			let handler2: (payload: { test: string }) => Promise<void>;

			beforeEach(() => {
				handler1 = vi.fn().mockResolvedValue(undefined);
				handler2 = vi.fn().mockResolvedValue(undefined);
				nodeEventBus.removeAllListeners();
			});

			describe('When the event is dispatched', () => {
				it('Then all handlers should be called in the order they were registered', async () => {
					//
					// Arrange
					const callOrder: string[] = [];
					const orderedHandler1 = vi.fn(() =>
						Promise.resolve().then(() => {
							callOrder.push('handler1');
						}),
					);
					const orderedHandler2 = vi.fn(() =>
						Promise.resolve().then(() => {
							callOrder.push('handler2');
						}),
					);
					nodeEventBus.register(TestEvent, orderedHandler1);
					nodeEventBus.register(TestEvent, orderedHandler2);

					//
					// Act
					await nodeEventBus.dispatch(TestEvent, { test: 'data' });

					//
					// Assert
					expect(callOrder).toEqual(['handler1', 'handler2']);
				});

				it('Then all handlers should be called even if one throws, and errors are not propagated', async () => {
					//
					// Arrange
					handler1 = vi.fn().mockRejectedValue(new Error('handler1 error'));
					handler2 = vi.fn().mockResolvedValue(undefined);
					nodeEventBus.register(TestEvent, handler1);
					nodeEventBus.register(TestEvent, handler2);

					//
					// Act & Assert
					await expect(
						nodeEventBus.dispatch(TestEvent, { test: 'data' }),
					).resolves.not.toThrow();
					expect(handler1).toHaveBeenCalledWith({ test: 'data' });
					expect(handler2).toHaveBeenCalledWith({ test: 'data' });
				});

				it('Then all handlers should be called even if multiple throw, and errors are not propagated', async () => {
					//
					// Arrange
					handler1 = vi.fn().mockRejectedValue(new Error('handler1 error'));
					handler2 = vi.fn().mockRejectedValue(new Error('handler2 error'));
					nodeEventBus.register(TestEvent, handler1);
					nodeEventBus.register(TestEvent, handler2);

					//
					// Act & Assert
					await expect(
						nodeEventBus.dispatch(TestEvent, { test: 'data' }),
					).resolves.not.toThrow();
					expect(handler1).toHaveBeenCalledWith({ test: 'data' });
					expect(handler2).toHaveBeenCalledWith({ test: 'data' });
				});

				it('Then dispatch should notify all handlers but not wait for their completion', async () => {
					//
					// Arrange
					let handlerStarted = false;
					let handlerCompleted = false;
					const asyncHandler = vi.fn(async () => {
						handlerStarted = true;
						await new Promise((resolve) => setTimeout(resolve, 50));
						handlerCompleted = true;
					});
					nodeEventBus.register(TestEvent, asyncHandler);

					//
					// Act
					const dispatchPromise = nodeEventBus.dispatch(TestEvent, {
						test: 'data',
					});

					//
					// Assert
					// The handler should have started (called synchronously)
					await Promise.resolve(); // allow microtasks to run
					expect(handlerStarted).toBe(true);

					// But dispatch should resolve before the handler completes
					await dispatchPromise;
					expect(handlerCompleted).toBe(false);

					// Wait for the handler to actually finish (to avoid unhandled promise rejection in test)
					await new Promise((resolve) => setTimeout(resolve, 60));
					expect(handlerCompleted).toBe(true);
				});
			});
		});

		describe('Given no handlers registered for an event', () => {
			describe('When the event is dispatched', () => {
				it('Then dispatch should do nothing and not throw', async () => {
					//
					// Act & Assert
					await expect(
						nodeEventBus.dispatch(TestEvent, { test: 'data' }),
					).resolves.not.toThrow();
				});
			});
		});

		describe('Given a registered handler for an event', () => {
			describe('When removeAllListeners is called', () => {
				it('Then all handlers should be removed and subsequent dispatches do nothing', async () => {
					//
					// Arrange
					nodeEventBus.register(TestEvent, handler);
					nodeEventBus.removeAllListeners();

					//
					// Act
					await nodeEventBus.dispatch(TestEvent, { test: 'data' });

					//
					// Assert
					expect(handler).not.toHaveBeenCalled();
				});
			});
		});
	});
});
