import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';

import { EndUserPersonalInformation } from './end-user-personal-information.ts';
import type { EndUserIdentityDetailsProps } from './end-user-identity-details.ts';
import type { EndUserContactInformationProps } from './end-user-contact-information.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
  path.resolve(__dirname, 'features/end-user-personal-information.feature'),
);

function makeVisa() {
  return vi.mocked({
    determineIf: vi.fn(() => true),
  });
}

function makeIdentityDetailsProps(overrides = {}) {
  return {
    lastName: 'Smith',
    legalNameConsistsOfOneName: false,
    restOfName: 'Alice',
    ...overrides,
  };
}

function makeContactInformationProps(overrides = {}) {
  return {
    email: 'alice@cellix.com',
    ...overrides,
  };
}

function makePersonalInformationProps(overrides = {}) {
  return {
    identityDetails: makeIdentityDetailsProps(),
    contactInformation: makeContactInformationProps(),
    ...overrides,
  };
}

describeFeature(feature, ({ Scenario, Background, BeforeEachScenario }) => {
  let visa: ReturnType<typeof makeVisa>;
  let identityDetailsProps: ReturnType<typeof makeIdentityDetailsProps>;
  let contactInformationProps: ReturnType<typeof makeContactInformationProps>;
  let personalInformationProps: ReturnType<typeof makePersonalInformationProps>;
  let entity: EndUserPersonalInformation;

  BeforeEachScenario(() => {
    visa = makeVisa();
    identityDetailsProps = makeIdentityDetailsProps();
    contactInformationProps = makeContactInformationProps();
    personalInformationProps = makePersonalInformationProps();
    entity = new EndUserPersonalInformation(personalInformationProps, visa);
  });

  Background(({ Given, And }) => {
    Given('valid EndUserIdentityDetailsProps and EndUserContactInformationProps', () => {
      identityDetailsProps = makeIdentityDetailsProps();
      contactInformationProps = makeContactInformationProps();
      personalInformationProps = makePersonalInformationProps();
    });
    And('a valid UserVisa', () => {
      visa = makeVisa();
    });
  });

  Scenario('Creating a new EndUserPersonalInformation instance', ({ When, Then, And }) => {
    let newEntity: EndUserPersonalInformation;
    When('I create a new EndUserPersonalInformation using getNewInstance with the identity details and contact information', () => {
      newEntity = EndUserPersonalInformation.getNewInstance(
        personalInformationProps,
        visa,
        identityDetailsProps,
        contactInformationProps
      );
    });
    Then("the entity's identity details should be set to the provided identity details", () => {
      expect(newEntity.identityDetails).toBeDefined();
      expect(newEntity.identityDetails.lastName).toBe(identityDetailsProps.lastName);
      expect(newEntity.identityDetails.legalNameConsistsOfOneName).toBe(
        identityDetailsProps.legalNameConsistsOfOneName
      );
      expect(newEntity.identityDetails.restOfName).toBe(identityDetailsProps.restOfName);
    });
    And("the entity's contact information should be set to the provided contact information", () => {
      expect(newEntity.contactInformation).toBeDefined();
      expect(newEntity.contactInformation.email).toBe(contactInformationProps.email);
    });
  });

  Scenario('Setting identity details after creation', ({ Given, When, Then }) => {
    let changingIdentityDetailsAfterCreation: () => void;
    Given('an existing EndUserPersonalInformation instance', () => {
      entity = new EndUserPersonalInformation(personalInformationProps, visa);
    });
    When('I try to set the identity details', () => {
      changingIdentityDetailsAfterCreation = () => {
        // @ts-expect-error
        entity.identityDetails = makeIdentityDetailsProps({ lastName: 'NewLast' });
      };
    });
    Then('an error should be thrown indicating identity details cannot be set', () => {
      expect(changingIdentityDetailsAfterCreation).toThrow('Cannot set identity details');
    });
  });

  Scenario('Setting contact information after creation', ({ Given, When, Then }) => {
    let changingContactInformationAfterCreation: () => void;
    Given('an existing EndUserPersonalInformation instance', () => {
      entity = new EndUserPersonalInformation(personalInformationProps, visa);
    });
    When('I try to set the contact information', () => {
      changingContactInformationAfterCreation = () => {
        // @ts-expect-error
        entity.contactInformation = makeContactInformationProps({ email: 'bob@cellix.com' });
      };
    });
    Then('an error should be thrown indicating contact information cannot be set', () => {
      expect(changingContactInformationAfterCreation).toThrow('Cannot set contact information');
    });
  });

  Scenario('Getting identity details and contact information', ({ Given, When, Then }) => {
    let identityDetails: EndUserIdentityDetailsProps;
    let contactInformation: EndUserContactInformationProps;
    Given('an EndUserPersonalInformation instance', () => {
      entity = new EndUserPersonalInformation(personalInformationProps, visa);
    });
    When('I access identity details and contact information', () => {
      identityDetails = entity.identityDetails;
      contactInformation = entity.contactInformation;
    });
    Then('I should receive EndUserIdentityDetails and EndUserContactInformation entity instances', () => {
      expect(identityDetails).toBeDefined();
      expect(identityDetails.lastName).toBe(personalInformationProps.identityDetails.lastName);
      expect(identityDetails.legalNameConsistsOfOneName).toBe(personalInformationProps.identityDetails.legalNameConsistsOfOneName);
      expect(identityDetails.restOfName).toBe(personalInformationProps.identityDetails.restOfName);
      expect(contactInformation).toBeDefined();
      expect(contactInformation.email).toBe(personalInformationProps.contactInformation.email);
    });
  });
});
