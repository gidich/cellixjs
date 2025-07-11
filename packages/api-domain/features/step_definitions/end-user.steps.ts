import { Given, When, Then, Before } from '@cucumber/cucumber';
// Import Jest utilities and expect from compatible sources
import * as jest from 'jest-mock';
import { expect } from 'expect';
// Import Serenity-JS dependencies
import { actorCalled, Question, Task } from '@serenity-js/core';
import type { Actor, AnswersQuestions, UsesAbilities } from '@serenity-js/core';
import { EndUser, type EndUserProps } from '../../src/domain/contexts/user/end-user/end-user.ts';
import { EndUserCreatedEvent } from '../../src/domain/events/types/end-user-created.ts';
import type { Passport } from '../../src/domain/contexts/passport.ts';
import type { UserDomainPermissions } from '../../src/domain/contexts/user/user.domain-permissions.ts';
import type { UserVisa } from '../../src/domain/contexts/user/user.visa.ts';

// Memory store for test state (Serenity approach)
const testMemory = new Map<string, any>();

// Helper functions for test memory management
const remember = (key: string, value: any) => {
  testMemory.set(key, value);
};

const recall = <T>(key: string): T => {
  return testMemory.get(key);
};

const clearMemory = () => {
  testMemory.clear();
};

// Serenity Actor - Global actor for cucumber steps
let endUserAdmin: Actor;

// Serenity Tasks
class SetupEndUserCreationContext extends Task {
  static with(
    externalId: string,
    lastName: string,
    restOfName: string,
    email: string,
    permissions: Partial<UserDomainPermissions>
  ) {
    return new SetupEndUserCreationContext(externalId, lastName, restOfName, email, permissions);
  }

  private externalId: string;
  private lastName: string;
  private restOfName: string;
  private email: string;
  private permissions: Partial<UserDomainPermissions>;
  
  constructor(
    externalId: string,
    lastName: string,
    restOfName: string,
    email: string,
    permissions: Partial<UserDomainPermissions>
  ) {
    super(`Setup end user creation context for "${lastName}, ${restOfName}" with specified permissions`);
    this.externalId = externalId;
    this.lastName = lastName;
    this.restOfName = restOfName;
    this.email = email;
    this.permissions = permissions;
  }

  performAs(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<void> {
    const expectedNewId = '12345';
    
    // Create mock objects using Jest mock functions
    const userProps = jest.mocked({
      id: expectedNewId,
      personalInformation: { contactInformation: {}, identityDetails: {} },
    } as EndUserProps);

    // Create mock user visa using Jest mock functions
    const mockUserVisa = jest.mocked({
      determineIf: (
        fn: (permissions: Readonly<UserDomainPermissions>) => boolean,
      ) => {
        return fn(this.permissions as UserDomainPermissions);
      },
    } as UserVisa);

    // Create mock passport using Jest mock functions
    const passport = jest.mocked({
      user: {
        forStaffRole: jest.fn(() => mockUserVisa),
        forEndUser: jest.fn(() => mockUserVisa),
        forStaffUser: jest.fn(() => mockUserVisa),
        forVendorUser: jest.fn(() => mockUserVisa),
      },
      community: {} as Passport['community'],
      service: {} as Passport['service'],
    } as Passport);

    remember('userProps', userProps);
    remember('externalId', this.externalId);
    remember('lastName', this.lastName);
    remember('restOfName', this.restOfName);
    remember('email', this.email);
    remember('passport', passport);
    remember('expectedId', expectedNewId);

    return Promise.resolve();
  }
}

class CreateEndUser extends Task {
  static withValidData() {
    return new CreateEndUser();
  }

  constructor() {
    super(`Create a new end user using valid data and proper permissions`);
  }

  performAs(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<void> {
    const props = recall<EndUserProps>('userProps');
    const passport = recall<Passport>('passport');
    const externalId = recall<string>('externalId');
    const lastName = recall<string>('lastName');
    const restOfName = recall<string>('restOfName');
    const email = recall<string>('email');

    try {
      const endUser = EndUser.getNewInstance(
        props,
        passport,
        externalId,
        lastName,
        restOfName,
        email,
      );
      remember('createdEndUser', endUser);
      remember('endUserCreationResult', 'success');
    } catch (error) {
      remember('endUserCreationError', error);
      remember('endUserCreationResult', 'error');
    }

    return Promise.resolve();
  }
}

class AttemptToCreateEndUserWithInvalidExternalId extends Task {
  static withExternalId(invalidExternalId: string) {
    return new AttemptToCreateEndUserWithInvalidExternalId(invalidExternalId);
  }

  private invalidExternalId: string;
  
  constructor(invalidExternalId: string) {
    super(`Attempt to create end user with invalid external ID: ${invalidExternalId}`);
    this.invalidExternalId = invalidExternalId;
  }

  performAs(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<void> {
    const props = recall<EndUserProps>('userProps');
    const passport = recall<Passport>('passport');
    const lastName = recall<string>('lastName');
    const restOfName = recall<string>('restOfName');
    const email = recall<string>('email');

    try {
      const endUser = EndUser.getNewInstance(
        props,
        passport,
        this.invalidExternalId,
        lastName,
        restOfName,
        email,
      );
      remember('createdEndUser', endUser);
      remember('endUserCreationResult', 'success');
    } catch (error) {
      remember('endUserCreationError', error);
      remember('endUserCreationResult', 'error');
    }

    return Promise.resolve();
  }
}

class AttemptToCreateEndUserWithInvalidRestOfName extends Task {
  static withRestOfName(invalidRestOfName: string) {
    return new AttemptToCreateEndUserWithInvalidRestOfName(invalidRestOfName);
  }

  private invalidRestOfName: string;
  
  constructor(invalidRestOfName: string) {
    super(`Attempt to create end user with invalid rest of name (${invalidRestOfName.length} characters)`);
    this.invalidRestOfName = invalidRestOfName;
  }

  performAs(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<void> {
    const props = recall<EndUserProps>('userProps');
    const passport = recall<Passport>('passport');
    const externalId = recall<string>('externalId');
    const lastName = recall<string>('lastName');
    const email = recall<string>('email');

    try {
      const endUser = EndUser.getNewInstance(
        props,
        passport,
        externalId,
        lastName,
        this.invalidRestOfName,
        email,
      );
      remember('createdEndUser', endUser);
      remember('endUserCreationResult', 'success');
    } catch (error) {
      remember('endUserCreationError', error);
      remember('endUserCreationResult', 'error');
    }

    return Promise.resolve();
  }
}

class AttemptToCreateEndUserWithInvalidLastName extends Task {
  static withLastName(invalidLastName: string) {
    return new AttemptToCreateEndUserWithInvalidLastName(invalidLastName);
  }

  private invalidLastName: string;
  
  constructor(invalidLastName: string) {
    super(`Attempt to create end user with invalid last name (${invalidLastName.length} characters)`);
    this.invalidLastName = invalidLastName;
  }

  performAs(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<void> {
    const props = recall<EndUserProps>('userProps');
    const passport = recall<Passport>('passport');
    const externalId = recall<string>('externalId');
    const restOfName = recall<string>('restOfName');
    const email = recall<string>('email');

    try {
      const endUser = EndUser.getNewInstance(
        props,
        passport,
        externalId,
        this.invalidLastName,
        restOfName,
        email,
      );
      remember('createdEndUser', endUser);
      remember('endUserCreationResult', 'success');
    } catch (error) {
      remember('endUserCreationError', error);
      remember('endUserCreationResult', 'error');
    }

    return Promise.resolve();
  }
}

class UpdateEndUserEmail extends Task {
  static withEmail(email: string) {
    return new UpdateEndUserEmail(email);
  }

  private email: string;
  
  constructor(email: string) {
    super(`Update end user email to: ${email}`);
    this.email = email;
  }

  performAs(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<void> {
    const endUser = recall<EndUser<EndUserProps>>('createdEndUser');

    try {
      endUser.personalInformation.contactInformation.email = this.email;
      remember('endUserUpdateResult', 'success');
    } catch (error) {
      remember('endUserUpdateError', error);
      remember('endUserUpdateResult', 'error');
    }

    return Promise.resolve();
  }
}

// Serenity Questions - Using function-based approach for better reporting
const TheEndUserCreationResult = () => 
  Question.about<string>('the result of the end user creation attempt', () => {
    return recall<string>('endUserCreationResult');
  });

const TheEndUserCreationError = () => 
  Question.about<Error>('the error details from the failed end user creation', () => {
    return recall<Error>('endUserCreationError');
  });

const TheEndUserUpdateResult = () => 
  Question.about<string>('the result of the end user update attempt', () => {
    return recall<string>('endUserUpdateResult');
  });

const TheEndUserUpdateError = () => 
  Question.about<Error>('the error details from the failed end user update', () => {
    return recall<Error>('endUserUpdateError');
  });

const TheCreatedEndUser = () => 
  Question.about<EndUser<EndUserProps>>('the successfully created end user', () => {
    return recall<EndUser<EndUserProps>>('createdEndUser');
  });

const TheEndUserEvents = (eventType: any) => 
  Question.about<any[]>(`the ${eventType.name} events raised by the end user`, () => {
    const endUser = recall<EndUser<EndUserProps>>('createdEndUser');
    if (!endUser) {
      return [];
    }
    return endUser.getIntegrationEvents().filter(e => e instanceof eventType);
  });

const TheExpectedEndUserId = () => 
  Question.about<string>('the expected ID for the new end user', () => {
    return recall<string>('expectedId');
  });

const TheEndUserLegalNameConsistsOfOneName = () => 
  Question.about<boolean>('whether the end user legal name consists of one name', () => {
    const endUser = recall<EndUser<EndUserProps>>('createdEndUser');
    return endUser.personalInformation.identityDetails.legalNameConsistsOfOneName;
  });

Before(() => {
  clearMemory();
  endUserAdmin = actorCalled('End User Admin');
});

Given('an end user administrator with valid permissions', () => {
  remember('permissions', {
    canManageEndUsers: true,
  });
});

Given('a valid external ID {string}', (externalId: string) => {
  remember('externalId', externalId);
});

Given('a valid last name {string}', (lastName: string) => {
  remember('lastName', lastName);
});

Given('a valid rest of name {string}', (restOfName: string) => {
  remember('restOfName', restOfName);
});

Given('an empty rest of name', () => {
  remember('restOfName', '');
});

Given('a valid email {string}', (email: string) => {
  remember('email', email);
});

Given('an invalid external ID {string}', (invalidExternalId: string) => {
  remember('externalId', invalidExternalId);
});

Given('an invalid rest of name that is too long', () => {
  // 501 characters -> exceeds the limit
  const invalidRestOfName = 'U3edLYh3jCG6qVcJyp4VYbWVBHCD72tEWxveuKM52pp5VV77otbhztgp5HJrvRshhHxjxDTiWEsuskVBFKd2WosKOvBCvXHZMy0sE7iXzLA9q8m6vevUK0UUnUsImby5uuun3R1LbjsQucbLO9R1GLnvYBWBbvVbpT6Wycq4JDfJWfjamxLmCqxjlhFMyUDMm2XMvkKdBVfYVJ9zx13HInjGSliPOgY5Ab3gVTx0r7v6VJ5gOxfoe762uemL9u3LvNvQaR89UgopJEwIYe3UanhkqXshFxK9Ryk7C38KLRzrTqbsfLedIISlBlrGaIQlWw44ehMaFx1D7eupzO49NQn5gCMiZN3lVwK1P6Ipq2w8hLjDY17rjLYo9HIF1cTVXzIB01n7ecQfP5YB7nIAT8uFEV34RPRCS3OU6WSLuFkOeC1xb2ssMATDvRfBiuZr9yraH43jipwV3QE2g3q3FrTGvmhZrrjjjedmj0iqpRGGHZRN9z9jU';
  remember('restOfName', invalidRestOfName);
});

Given('an invalid last name that is too long', () => {
  // 501 characters -> exceeds the limit
  const invalidLastName = 'U3edLYh3jCG6qVcJyp4VYbWVBHCD72tEWxveuKM52pp5VV77otbhztgp5HJrvRshhHxjxDTiWEsuskVBFKd2WosKOvBCvXHZMy0sE7iXzLA9q8m6vevUK0UUnUsImby5uuun3R1LbjsQucbLO9R1GLnvYBWBbvVbpT6Wycq4JDfJWfjamxLmCqxjlhFMyUDMm2XMvkKdBVfYVJ9zx13HInjGSliPOgY5Ab3gVTx0r7v6VJ5gOxfoe762uemL9u3LvNvQaR89UgopJEwIYe3UanhkqXshFxK9Ryk7C38KLRzrTqbsfLedIISlBlrGaIQlWw44ehMaFx1D7eupzO49NQn5gCMiZN3lVwK1P6Ipq2w8hLjDY17rjLYo9HIF1cTVXzIB01n7ecQfP5YB7nIAT8uFEV34RPRCS3OU6WSLuFkOeC1xb2ssMATDvRfBiuZr9yraH43jipwV3QE2g3q3FrTGvmhZrrjjjedmj0iqpRGGHZRN9z9jU';
  remember('lastName', invalidLastName);
});

Given('the required end user creation context is set up', async () => {
  const externalId = recall<string>('externalId');
  const lastName = recall<string>('lastName');
  const restOfName = recall<string>('restOfName');
  const email = recall<string>('email');
  const permissions = recall<Partial<UserDomainPermissions>>('permissions');
  
  await endUserAdmin.attemptsTo(
    SetupEndUserCreationContext.with(externalId, lastName, restOfName, email, permissions)
  );
});

Given('a created end user', async () => {
  await endUserAdmin.attemptsTo(CreateEndUser.withValidData());
});

When('I create a new end user', async () => {
  await endUserAdmin.attemptsTo(CreateEndUser.withValidData());
});

When('I attempt to create an end user with the invalid external ID', async () => {
  const invalidExternalId = recall<string>('externalId');
  await endUserAdmin.attemptsTo(
    AttemptToCreateEndUserWithInvalidExternalId.withExternalId(invalidExternalId)
  );
});

When('I attempt to create an end user with the invalid rest of name', async () => {
  const invalidRestOfName = recall<string>('restOfName');
  await endUserAdmin.attemptsTo(
    AttemptToCreateEndUserWithInvalidRestOfName.withRestOfName(invalidRestOfName)
  );
});

When('I attempt to create an end user with the invalid last name', async () => {
  const invalidLastName = recall<string>('lastName');
  await endUserAdmin.attemptsTo(
    AttemptToCreateEndUserWithInvalidLastName.withLastName(invalidLastName)
  );
});

When('I update the end user email to {string}', async (email: string) => {
  await endUserAdmin.attemptsTo(
    UpdateEndUserEmail.withEmail(email)
  );
});

Then('the end user should be created successfully', async () => {
  const result = await endUserAdmin.answer(TheEndUserCreationResult());
  expect(result).toBe('success');
  
  const createdEndUser = await endUserAdmin.answer(TheCreatedEndUser());
  expect(createdEndUser).toBeDefined();
});

Then('an EndUserCreatedEvent should be raised', async () => {
  const endUserEvents = await endUserAdmin.answer(TheEndUserEvents(EndUserCreatedEvent));
  expect(endUserEvents).toHaveLength(1);
  
  const createdEvent = endUserEvents[0] as EndUserCreatedEvent;
  const expectedId = await endUserAdmin.answer(TheExpectedEndUserId());
  expect(createdEvent.payload.userId).toBe(expectedId);
});

Then('the legal name should consist of multiple names', async () => {
  expect(await endUserAdmin.answer(TheEndUserLegalNameConsistsOfOneName())).toBe(false);
});

Then('the legal name should consist of one name', async () => {
  expect(await endUserAdmin.answer(TheEndUserLegalNameConsistsOfOneName())).toBe(true);
});

Then('the end user creation should fail', async () => {
  const result = await endUserAdmin.answer(TheEndUserCreationResult());
  expect(result).toBe('error');
  
  const error = await endUserAdmin.answer(TheEndUserCreationError());
  expect(error).toBeDefined();
});

Then('the error should indicate the external ID is too short', async () => {
  const error = await endUserAdmin.answer(TheEndUserCreationError());
  expect(error).toEqual(
    expect.objectContaining({
      message: expect.stringContaining('Too short'),
    })
  );
});

Then('the error should indicate the rest of name is too long', async () => {
  const error = await endUserAdmin.answer(TheEndUserCreationError());
  expect(error).toEqual(
    expect.objectContaining({
      message: expect.stringContaining('Too long'),
    })
  );
});

Then('the error should indicate the last name is too long', async () => {
  const error = await endUserAdmin.answer(TheEndUserCreationError());
  expect(error).toEqual(
    expect.objectContaining({
      message: expect.stringContaining('Too long'),
    })
  );
});

Then('the end user update should fail', async () => {
  const result = await endUserAdmin.answer(TheEndUserUpdateResult());
  expect(result).toBe('error');
  
  const error = await endUserAdmin.answer(TheEndUserUpdateError());
  expect(error).toBeDefined();
});

Then('the error should indicate the end user email format is invalid', async () => {
  const error = await endUserAdmin.answer(TheEndUserUpdateError());
  expect(error).toEqual(
    expect.objectContaining({
      message: expect.stringContaining("Value doesn't match pattern"),
    })
  );
});

Then('the end user update should be successful', async () => {
  const result = await endUserAdmin.answer(TheEndUserUpdateResult());
  expect(result).toBe('success');
});
