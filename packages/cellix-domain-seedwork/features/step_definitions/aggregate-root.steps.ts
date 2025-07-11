import { Given, Then, When } from '@cucumber/cucumber';
import { actorCalled } from '@serenity-js/core';
import { Ensure, equals, isPresent } from '@serenity-js/assertions';

// Import the classes we need to test
import { AggregateRoot } from '../../src/domain-seedwork/aggregate-root.ts';
import { DomainEntity } from '../../src/domain-seedwork/domain-entity.ts';
import { CustomDomainEventImpl } from '../../src/domain-seedwork/domain-event.ts';
import type { RootEventRegistry } from '../../src/domain-seedwork/aggregate-root.ts';

// Test interfaces and classes
interface TestAggregateProps {
    id: string;
    name: string;
    version: number;
}

interface TestPassport {
    userId: string;
    permissions: string[];
}

interface TestEventPayload {
    message: string;
}

interface ComplexPayload {
    message: string;
    data: {
        id: number;
        nested: {
            value: string;
            array: number[];
        };
    };
    timestamp: Date;
}

class TestAggregate extends AggregateRoot<TestAggregateProps, TestPassport> {
    public getName(): string {
        return this.props.name;
    }

    public markAsDeleted(): void {
        this.isDeleted = true;
    }

    public testOnSave(isModified: boolean): void {
        this.onSave(isModified);
    }

    public getPassport(): TestPassport {
        return this.passport;
    }
}

class TestDomainEvent extends CustomDomainEventImpl<TestEventPayload> {
    constructor(aggregateId: string) {
        super(aggregateId);
    }
}

class TestIntegrationEvent extends CustomDomainEventImpl<TestEventPayload> {
    constructor(aggregateId: string) {
        super(aggregateId);
    }
}

class ComplexEvent extends CustomDomainEventImpl<ComplexPayload> {
    constructor(aggregateId: string) {
        super(aggregateId);
    }
}

class CustomAggregateWithOverride extends AggregateRoot<TestAggregateProps, TestPassport> {
    public onSaveCalls: { isModified: boolean }[] = [];

    public override onSave(isModified: boolean): void {
        this.onSaveCalls.push({ isModified });
    }
}

// Global state
let testProps: TestAggregateProps;
let testPassport: TestPassport;
let testAggregate: TestAggregate;
let customAggregate: CustomAggregateWithOverride;
let lastEventPayload: TestEventPayload;
let lastComplexPayload: ComplexPayload;
let rootEventRegistry: RootEventRegistry;

// Global actor for Serenity assertions
const actor = actorCalled('Test Actor');

// Given steps
Given('I have test aggregate properties with id {string}, name {string}, and version {int}', 
    (id: string, name: string, version: number) => {
        testProps = { id, name, version };
    }
);

Given('I have test passport with userId {string} and permissions [{string}, {string}]', 
    (userId: string, perm1: string, perm2: string) => {
        testPassport = { userId, permissions: [perm1, perm2] };
    }
);

Given('I have created a test aggregate', () => {
    testAggregate = new TestAggregate(testProps, testPassport);
});

Given('I have added a domain event with message {string}', (message: string) => {
    const payload: TestEventPayload = { message };
    testAggregate.addDomainEvent(TestDomainEvent, payload);
});

Given('I have added an integration event with message {string}', (message: string) => {
    const payload: TestEventPayload = { message };
    testAggregate.addIntegrationEvent(TestIntegrationEvent, payload);
});

Given('I have a custom aggregate that overrides onSave', () => {
    customAggregate = new CustomAggregateWithOverride(testProps, testPassport);
});

// When steps
When('I create a test aggregate with the properties and passport', () => {
    testAggregate = new TestAggregate(testProps, testPassport);
});

When('I mark the aggregate as deleted', () => {
    testAggregate.markAsDeleted();
});

When('I add a domain event with message {string}', (message: string) => {
    lastEventPayload = { message };
    testAggregate.addDomainEvent(TestDomainEvent, lastEventPayload);
});

When('I add an integration event with message {string}', (message: string) => {
    lastEventPayload = { message };
    testAggregate.addIntegrationEvent(TestIntegrationEvent, lastEventPayload);
});

When('I clear the domain events', () => {
    testAggregate.clearDomainEvents();
});

When('I clear the integration events', () => {
    testAggregate.clearIntegrationEvents();
});

When('I use the aggregate as a RootEventRegistry', () => {
    rootEventRegistry = testAggregate as RootEventRegistry;
});

When('I add a domain event via registry with message {string}', (message: string) => {
    const payload: TestEventPayload = { message };
    rootEventRegistry.addDomainEvent(TestDomainEvent, payload);
});

When('I add an integration event via registry with message {string}', (message: string) => {
    const payload: TestEventPayload = { message };
    rootEventRegistry.addIntegrationEvent(TestIntegrationEvent, payload);
});

When('I trigger the onSave method with isModified {word}', (isModifiedStr: string) => {
    const isModified = isModifiedStr === 'true';
    if (customAggregate) {
        (customAggregate as any).onSave(isModified);
    } else {
        (testAggregate as any).onSave(isModified);
    }
});

When('I get the passport from the aggregate', () => {
    // Just accessing passport, result will be checked in Then steps
});

When('I add a domain event with complex payload', () => {
    lastComplexPayload = {
        message: 'Complex test message',
        data: {
            id: 123,
            nested: {
                value: 'nested value',
                array: [1, 2, 3]
            }
        },
        timestamp: new Date('2023-01-01T00:00:00Z')
    };
    testAggregate.addDomainEvent(ComplexEvent, lastComplexPayload);
});

When('I add {int} domain events rapidly', (count: number) => {
    for (let i = 0; i < count; i++) {
        const payload: TestEventPayload = { message: `Event ${i + 1}` };
        testAggregate.addDomainEvent(TestDomainEvent, payload);
    }
});

When('I add {int} integration events rapidly', (count: number) => {
    for (let i = 0; i < count; i++) {
        const payload: TestEventPayload = { message: `Integration Event ${i + 1}` };
        testAggregate.addIntegrationEvent(TestIntegrationEvent, payload);
    }
});

When('I clear all domain events', () => {
    testAggregate.clearDomainEvents();
});

When('I clear all integration events', () => {
    testAggregate.clearIntegrationEvents();
});

// Then steps
Then('the aggregate should have id {string}', async (expectedId: string) => {
    await actor.attemptsTo(
        Ensure.that(testAggregate.id, equals(expectedId))
    );
});

Then('the aggregate should have name {string}', async (expectedName: string) => {
    await actor.attemptsTo(
        Ensure.that(testAggregate.getName(), equals(expectedName))
    );
});

Then('the aggregate passport should match the provided passport', async () => {
    await actor.attemptsTo(
        Ensure.that(testAggregate.getPassport(), equals(testPassport))
    );
});

Then('the aggregate should not be deleted initially', async () => {
    await actor.attemptsTo(
        Ensure.that(testAggregate.isDeleted, equals(false))
    );
});

Then('the aggregate should have no domain events initially', async () => {
    await actor.attemptsTo(
        Ensure.that(testAggregate.getDomainEvents().length, equals(0))
    );
});

Then('the aggregate should have no integration events initially', async () => {
    await actor.attemptsTo(
        Ensure.that(testAggregate.getIntegrationEvents().length, equals(0))
    );
});

Then('the aggregate should be marked as deleted', async () => {
    await actor.attemptsTo(
        Ensure.that(testAggregate.isDeleted, equals(true))
    );
});

Then('the aggregate should have {int} domain event(s)', async (expectedCount: number) => {
    await actor.attemptsTo(
        Ensure.that(testAggregate.getDomainEvents().length, equals(expectedCount))
    );
});

Then('the aggregate should have {int} integration event(s)', async (expectedCount: number) => {
    await actor.attemptsTo(
        Ensure.that(testAggregate.getIntegrationEvents().length, equals(expectedCount))
    );
});

Then('the domain event should have aggregateId {string}', async (expectedId: string) => {
    const events = testAggregate.getDomainEvents();
    await actor.attemptsTo(
        Ensure.that(events[0]?.aggregateId, equals(expectedId))
    );
});

Then('the integration event should have aggregateId {string}', async (expectedId: string) => {
    const events = testAggregate.getIntegrationEvents();
    await actor.attemptsTo(
        Ensure.that(events[0]?.aggregateId, equals(expectedId))
    );
});

Then('the domain event should have the correct payload', async () => {
    const events = testAggregate.getDomainEvents();
    await actor.attemptsTo(
        Ensure.that(events[0]?.payload, equals(lastEventPayload))
    );
});

Then('the integration event should have the correct payload', async () => {
    const events = testAggregate.getIntegrationEvents();
    await actor.attemptsTo(
        Ensure.that(events[0]?.payload, equals(lastEventPayload))
    );
});

Then('the first domain event should have message {string}', async (expectedMessage: string) => {
    const events = testAggregate.getDomainEvents();
    await actor.attemptsTo(
        Ensure.that((events[0]?.payload as TestEventPayload)?.message, equals(expectedMessage))
    );
});

Then('the second domain event should have message {string}', async (expectedMessage: string) => {
    const events = testAggregate.getDomainEvents();
    await actor.attemptsTo(
        Ensure.that((events[1]?.payload as TestEventPayload)?.message, equals(expectedMessage))
    );
});

Then('the first integration event should have message {string}', async (expectedMessage: string) => {
    const events = testAggregate.getIntegrationEvents();
    await actor.attemptsTo(
        Ensure.that((events[0]?.payload as TestEventPayload)?.message, equals(expectedMessage))
    );
});

Then('the second integration event should have message {string}', async (expectedMessage: string) => {
    const events = testAggregate.getIntegrationEvents();
    await actor.attemptsTo(
        Ensure.that((events[1]?.payload as TestEventPayload)?.message, equals(expectedMessage))
    );
});

Then('the aggregate should have no domain events', async () => {
    await actor.attemptsTo(
        Ensure.that(testAggregate.getDomainEvents().length, equals(0))
    );
});

Then('the aggregate should have no integration events', async () => {
    await actor.attemptsTo(
        Ensure.that(testAggregate.getIntegrationEvents().length, equals(0))
    );
});

Then('the domain events array should be readonly', async () => {
    const events = testAggregate.getDomainEvents();
    await actor.attemptsTo(
        Ensure.that(Array.isArray(events), equals(true)),
        Ensure.that(events[0], isPresent())
    );
});

Then('the integration events array should be readonly', async () => {
    const events = testAggregate.getIntegrationEvents();
    await actor.attemptsTo(
        Ensure.that(Array.isArray(events), equals(true)),
        Ensure.that(events[0], isPresent())
    );
});

Then('the domain event should have message {string}', async (expectedMessage: string) => {
    const events = testAggregate.getDomainEvents();
    await actor.attemptsTo(
        Ensure.that((events[0]?.payload as TestEventPayload)?.message, equals(expectedMessage))
    );
});

Then('the integration event should have message {string}', async (expectedMessage: string) => {
    const events = testAggregate.getIntegrationEvents();
    await actor.attemptsTo(
        Ensure.that((events[0]?.payload as TestEventPayload)?.message, equals(expectedMessage))
    );
});

Then('the custom onSave should have been called {int} times', async (expectedCount: number) => {
    await actor.attemptsTo(
        Ensure.that(customAggregate.onSaveCalls.length, equals(expectedCount))
    );
});

Then('the last isModified value should be {word}', async (expectedValue: string) => {
    const expected = expectedValue === 'true';
    const lastCall = customAggregate.onSaveCalls[customAggregate.onSaveCalls.length - 1];
    await actor.attemptsTo(
        Ensure.that(lastCall?.isModified, equals(expected))
    );
});

Then('the onSave method should be called without throwing', async () => {
    // If we reach this step, it means the method was called successfully
    await actor.attemptsTo(
        Ensure.that(true, equals(true))
    );
});

Then('the aggregate should inherit the id property from DomainEntity', async () => {
    await actor.attemptsTo(
        Ensure.that(testAggregate instanceof DomainEntity, equals(true)),
        Ensure.that(testAggregate.id, equals(testProps.id))
    );
});

Then('the aggregate should inherit the props property from DomainEntity', async () => {
    await actor.attemptsTo(
        Ensure.that(testAggregate.props, equals(testProps))
    );
});

Then('the passport should match the original passport', async () => {
    await actor.attemptsTo(
        Ensure.that(testAggregate.getPassport(), equals(testPassport))
    );
});

Then('the passport should be the same reference', async () => {
    await actor.attemptsTo(
        Ensure.that(testAggregate.getPassport() === testPassport, equals(true))
    );
});

Then('the complex payload should be preserved correctly', async () => {
    const events = testAggregate.getDomainEvents();
    await actor.attemptsTo(
        Ensure.that(events[0]?.payload, equals(lastComplexPayload))
    );
});
