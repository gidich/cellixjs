import { beforeEach, describe, expect, it, vi } from 'vitest';
import { InProcEventBusInstance } from './in-proc-event-bus.ts';
import { DomainSeedwork } from '@cellix/domain-seedwork';


describe('InProcEventBusImpl', () => {
    
    describe('Scenario: Initializing the InProcEventBusImpl', () => {
        describe('Given the InProcEventBusInstance singleton', () => {
            describe('When the instance has not been initialized', () => {
                it('Then it should initialize the instance and return it', () => {
                    const instance1 = InProcEventBusInstance;
                    expect(instance1).toBeDefined();
                    expect(instance1).toBeInstanceOf(InProcEventBusInstance.constructor);
                    expect(typeof InProcEventBusInstance.dispatch).toBe('function');
                    expect(typeof InProcEventBusInstance.register).toBe('function');
                });
            });
            describe('When the instance has already been initialized', () => {
                it('Then it should return the same instance', () => {
                    const instance1 = InProcEventBusInstance;
                    const instance2 = InProcEventBusInstance;
                    expect(instance1).toBe(instance2);
                });
            });
        });
    });

    describe('Scenario: Registering and Dispatching Event Handlers on InProcEventBusImpl', () => {
        describe('Given an event class and a handler', () => {
            class TestEvent extends DomainSeedwork.CustomDomainEventImpl<{ test: string }> {}
            let handler: (payload: { test: string }) => Promise<void>;

            beforeEach(() => {
                // Mock a consumer implementation for the event handler. Only need to type event payload on the input and make it async
                handler = vi.fn().mockResolvedValue(undefined);
                // Reset the singleton's subscribers for isolation
                (InProcEventBusInstance as unknown as { eventSubscribers: Record<string, Array<(rawpayload: string) => Promise<void>> | undefined> }).eventSubscribers = {};
            });

            describe('When the handler is registered', () => {
                it('Then it should be called when the event is dispatched', async () => {
                    InProcEventBusInstance.register(TestEvent, handler);
                    await InProcEventBusInstance.dispatch(TestEvent, { test: 'data' });
                    expect(handler).toHaveBeenCalledWith({ test: 'data' });
                });
            });
        });
        describe('Given multiple handlers for the same event class', () => {
            class TestEvent extends DomainSeedwork.CustomDomainEventImpl<{ test: string }> {}
            let handler1: (payload: { test: string }) => Promise<void>;
            let handler2: (payload: { test: string }) => Promise<void>;

            beforeEach(() => {
                handler1 = vi.fn().mockResolvedValue(undefined);
                handler2 = vi.fn().mockResolvedValue(undefined);
                // Reset the singleton's subscribers for isolation
                (InProcEventBusInstance as unknown as { eventSubscribers: Record<string, Array<(rawpayload: string) => Promise<void>> | undefined> }).eventSubscribers = {};
            });

            describe('When both handlers are registered', () => {
                it('Then both should be called when the event is dispatched', async () => {
                    InProcEventBusInstance.register(TestEvent, handler1);
                    InProcEventBusInstance.register(TestEvent, handler2);
                    await InProcEventBusInstance.dispatch(TestEvent, { test: 'data' });
                    expect(handler1).toHaveBeenCalledWith({ test: 'data' });
                    expect(handler2).toHaveBeenCalledWith({ test: 'data' });
                });
            });

            describe('When one handler throws and both are registered', () => {
                it('Then the other handler after the throwing one should NOT be called and the error should be propagated', async () => {
                    // Arrange
                    // handler1 will throw, handler2 should NOT be called
                    handler1 = vi.fn().mockRejectedValue(new Error('handler1 error'));
                    handler2 = vi.fn().mockResolvedValue(undefined);

                    InProcEventBusInstance.register(TestEvent, handler1);
                    InProcEventBusInstance.register(TestEvent, handler2);

                    // Act & Assert
                    await expect(InProcEventBusInstance.dispatch(TestEvent, { test: 'data' })).rejects.toThrow('handler1 error');
                    expect(handler1).toHaveBeenCalledWith({ test: 'data' });
                    expect(handler2).not.toHaveBeenCalled();
                });
            });
        });
        describe('Given handlers for different event classes', () => {
            class TestEventA extends DomainSeedwork.CustomDomainEventImpl<{ testA: string }> {}
            class TestEventB extends DomainSeedwork.CustomDomainEventImpl<{ testB: string }> {}
            let handlerA: (payload: { testA: string }) => Promise<void>;
            let handlerB: (payload: { testB: string }) => Promise<void>;

            beforeEach(() => {
                handlerA = vi.fn().mockResolvedValue(undefined);
                handlerB = vi.fn().mockResolvedValue(undefined);
                // Reset the singleton's subscribers for isolation
                (InProcEventBusInstance as unknown as { eventSubscribers: Record<string, Array<(rawpayload: string) => Promise<void>> | undefined> }).eventSubscribers = {};
            });

            describe('When both handlers are registered for different events', () => {
                it('Then only the correct handler should be called for each event', async () => {
                    InProcEventBusInstance.register(TestEventA, handlerA);
                    InProcEventBusInstance.register(TestEventB, handlerB);

                    await InProcEventBusInstance.dispatch(TestEventA, { testA: 'dataA' });
                    await InProcEventBusInstance.dispatch(TestEventB, { testB: 'dataB' });

                    expect(handlerA).toHaveBeenCalledWith({ testA: 'dataA' });
                    expect(handlerB).toHaveBeenCalledWith({ testB: 'dataB' });
                    expect(handlerB).toHaveBeenCalledTimes(1);
                    expect(handlerA).toHaveBeenCalledTimes(1);
                });
            });
        });
    });
});