// --- Test event helpers ---
// (keep only one import of DomainSeedwork, remove duplicate)

import { Community, type CommunityProps } from './community.ts';
import type { EndUserEntityReference } from '../../user/end-user/end-user.ts';
import type { CommunityVisa } from '../community.visa.ts';
import type { Passport } from '../../passport.ts';
import { CommunityCreatedEvent } from '../../../events/types/community-created.ts';
import type { CommunityPassport } from '../community.passport.ts';
import type { CommunityDomainPermissions } from '../community.domain-permissions.ts';
import { expect, vi } from 'vitest';
import type { UserPassport } from '../../user/user.passport.ts';
import type { DomainSeedwork } from '@cellix/domain-seedwork';
import {
	describeFeature,
	loadFeature
} from '@amiceli/vitest-cucumber';
import path from 'path';
import { fileURLToPath } from 'url';
import { CommunityWhiteLabelDomainUpdatedEvent } from '../../../events/types/community-white-label-domain-updated.ts';
import { CommunityDomainUpdatedEvent } from '../../../events/types/community-domain-updated.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const communityCreationFeature = await loadFeature(path.join(__dirname, 'features/community-creation.feature'));
const communityManagementFeature = await loadFeature(path.join(__dirname, 'features/community-management.feature'));

type IntegrationEvent = DomainSeedwork.DomainEvent & { aggregateId: string };
type EventClass<T extends IntegrationEvent> = abstract new (aggregateId: string) => T;

function findIntegrationEvent<T extends IntegrationEvent>(
  community: { getIntegrationEvents: () => readonly IntegrationEvent[]; id?: string } | undefined,
  eventClass: EventClass<T>
): T | undefined {
  if (!community) {
	return undefined;
  }
  return community
	.getIntegrationEvents()
	.find((e): e is T => e instanceof eventClass && e.aggregateId === community.id);
}

const getMockedPassport = (
	partialPermissions: Partial<CommunityDomainPermissions>,
): Passport => {
	const mockCommunityVisa = vi.mocked({
		determineIf: (
			fn: (permissions: Readonly<CommunityDomainPermissions>) => boolean,
		) => fn(partialPermissions as CommunityDomainPermissions),
	} as CommunityVisa);

	const givenValidPassport = vi.mocked({} as Passport);
	givenValidPassport.community = vi.mocked({
		forCommunity: vi.fn(() => mockCommunityVisa),
	} as CommunityPassport);

	givenValidPassport.user = vi.mocked({
		forEndUser: vi.fn(() => ({
			determineIf: vi.fn(() => true),
		})),
		forStaffRole: vi.fn(() => ({
			determineIf: vi.fn(() => true),
		})),
		forStaffUser: vi.fn(() => ({
			determineIf: vi.fn(() => true),
		})),
		forVendorUser: vi.fn(() => ({
			determineIf: vi.fn(() => true),
		})),
	} as UserPassport);

	return givenValidPassport;
};

function expectEventEmitted<T extends IntegrationEvent>(
  community: { getIntegrationEvents: () => readonly IntegrationEvent[]; id?: string } | undefined,
  eventClass: EventClass<T>,
  payloadMatcher?: (event: T) => void
) {
  const event = findIntegrationEvent(community, eventClass);
  expect(event).toBeDefined();
  expect(event).toBeInstanceOf(eventClass);
  if (payloadMatcher && event) {
	payloadMatcher(event as T);
  }
}


function expectNoEventEmitted(
  community: { getIntegrationEvents: () => readonly IntegrationEvent[]; id?: string } | undefined,
  eventClass: EventClass<IntegrationEvent>
) {
  const event = findIntegrationEvent(community, eventClass);
  expect(event).toBeUndefined();
}

describeFeature(
	communityCreationFeature,
	({ Scenario, Background, BeforeEachScenario }) => {
		let community: Community<CommunityProps> | undefined;
		let props: CommunityProps | undefined;
		let passport: Passport;
		let createdBy: EndUserEntityReference | undefined;
		let error: Error | undefined;
		let name: string | undefined;
		let event: CommunityCreatedEvent | undefined;

		BeforeEachScenario(() => {
			community = undefined;
			props = undefined;
			createdBy = undefined;
			error = undefined;
			name = undefined;
			event = undefined;
		});

		Background(({ Given }) => {
			Given('a user with the permission to create communities', () => {
				passport = getMockedPassport({ canCreateCommunities: true });
			});
		});

		Scenario(
			'Creating a new community with valid details',
			({ When, Then, And }) => {
				When(
					'the user attempts to create a community with a valid name and creator',
					() => {
						props = {
							id: '123',
							createdAt: new Date(),
							updatedAt: new Date(),
							schemaVersion: '1.0',
						} as CommunityProps;
						createdBy = { displayName: 'Test User' } as EndUserEntityReference;
						name = 'valid-community-name';
						try {
							community = Community.getNewInstance(
								props,
								name,
								createdBy,
								passport,
							);
						} catch (e) {
							error = e as Error;
						}
					},
				);

				Then('the community is created successfully', () => {
					expect(community).toBeDefined();
					expect(community).toBeInstanceOf(Community);
					expect(community?.name).toBe(name?.trim());
					expect(community?.createdBy.displayName).toBe('Test User');
				});

				And('a CommunityCreated event is emitted', () => {
					expectEventEmitted(community, CommunityCreatedEvent, (event) => {
						expect(event.aggregateId).toBe(community?.id);
						expect(event.payload).toEqual({ communityId: community?.id });
					});
				});
			},
		);

		Scenario(
			'Creating a community with a name at maximum length',
			({ When, Then, And }) => {
				When(
					'the user attempts to create a community with a name of exactly 200 characters',
					() => {
						props = {
							id: '123',
							createdAt: new Date(),
							updatedAt: new Date(),
							schemaVersion: '1.0',
						} as CommunityProps;
						createdBy = { displayName: 'Test User' } as EndUserEntityReference;
						name = 'a'.repeat(200);
						try {
							community = Community.getNewInstance(
								props,
								name,
								createdBy,
								passport,
							);
						} catch (e) {
							error = e as Error;
						}
					},
				);

				Then('the community is created successfully', () => {
					expect(community).toBeDefined();
					expect(community).toBeInstanceOf(Community);
					expect(community?.name).toBe(name?.trim());
					expect(community?.createdBy.displayName).toBe('Test User');
				});

				And('a CommunityCreated event is emitted', () => {
					event = community
						?.getIntegrationEvents()
						.find(
							(e: DomainSeedwork.DomainEvent) =>
								e.aggregateId === community?.id &&
								e instanceof CommunityCreatedEvent,
						) as CommunityCreatedEvent;
					expect(event).toBeDefined();
					expect(event).toBeInstanceOf(CommunityCreatedEvent);
					expect(event.aggregateId).toBe(community?.id);
					expect(event.payload).toEqual({
						communityId: community?.id,
					});
				});
			},
		);

		Scenario(
			'Creating a community with a name at minimum length',
			({ When, Then, And }) => {
				When(
					'the user attempts to create a community with a name of exactly 1 character',
					() => {
						props = {
							id: '123',
							createdAt: new Date(),
							updatedAt: new Date(),
							schemaVersion: '1.0',
						} as CommunityProps;
						createdBy = { displayName: 'Test User' } as EndUserEntityReference;
						name = 'a';
						try {
							community = Community.getNewInstance(
								props,
								name,
								createdBy,
								passport,
							);
						} catch (e) {
							error = e as Error;
						}
					},
				);

				Then('the community is created successfully', () => {
					expect(community).toBeDefined();
					expect(community).toBeInstanceOf(Community);
					expect(community?.name).toBe(name?.trim());
					expect(community?.createdBy.displayName).toBe('Test User');
				});

				And('a CommunityCreated event is emitted', () => {
					event = community
						?.getIntegrationEvents()
						.find(
							(e: DomainSeedwork.DomainEvent) =>
								e.aggregateId === community?.id &&
								e instanceof CommunityCreatedEvent,
						) as CommunityCreatedEvent;
					expect(event).toBeDefined();
					expect(event).toBeInstanceOf(CommunityCreatedEvent);
					expect(event.aggregateId).toBe(community?.id);
					expect(event.payload).toEqual({
						communityId: community?.id,
					});
				});
			},
		);

		Scenario(
			'Creating a community with a name that is too long',
			({ When, Then, And }) => {
				let community: Community<CommunityProps> | undefined;
				When(
					'the user attempts to create a community with a name longer than 200 characters',
					() => {
						props = {
							id: '123',
							createdAt: new Date(),
							updatedAt: new Date(),
							schemaVersion: '1.0',
						} as CommunityProps;
						createdBy = { displayName: 'Test User' } as EndUserEntityReference;
						name = 'a'.repeat(201);
						try {
							community = Community.getNewInstance(
								props,
								name,
								createdBy,
								passport,
							);
						} catch (e) {
							error = e as Error;
						}
					},
				);

				Then('the system rejects the creation with a "Too long" error', () => {
					expect(error).toBeDefined();
					expect(error?.message).toBe('Too long');
				});

				And('no CommunityCreated event is emitted', () => {
					expectNoEventEmitted(community, CommunityCreatedEvent);
				});
			},
		);

		Scenario(
			'Creating a community with a name that is too short',
			({ When, Then, And }) => {
				When(
					'the user attempts to create a community with a name shorter than 1 character',
					() => {
						props = {
							id: '123',
							createdAt: new Date(),
							updatedAt: new Date(),
							schemaVersion: '1.0',
						} as CommunityProps;
						createdBy = { displayName: 'Test User' } as EndUserEntityReference;
						name = '';
						try {
							community = Community.getNewInstance(
								props,
								name,
								createdBy,
								passport,
							);
						} catch (e) {
							error = e as Error;
						}
					},
				);

				Then('the system rejects the creation with a "Too short" error', () => {
					expect(error).toBeDefined();
					expect(error?.message).toBe('Too short');
				});

				And('no CommunityCreated event is emitted', () => {
					const event = community
						?.getIntegrationEvents()
						.find(
							(e: DomainSeedwork.DomainEvent) =>
								e.aggregateId === community?.id &&
								e instanceof CommunityCreatedEvent,
						) as CommunityCreatedEvent;
					expect(event).toBeUndefined();
				});
			},
		);

		Scenario(
			'Creating a community with an empty name',
			({ When, Then, And }) => {
				When(
					'the user attempts to create a community with an empty name',
					() => {
						props = {
							id: '123',
							createdAt: new Date(),
							updatedAt: new Date(),
							schemaVersion: '1.0',
						} as CommunityProps;
						createdBy = { displayName: 'Test User' } as EndUserEntityReference;
						try {
							community = Community.getNewInstance(
								props,
								// @ts-expect-error: testing null assignment not allowed
								null,
								createdBy,
								passport,
							);
						} catch (e) {
							error = e as Error;
						}
					},
				);

				Then(
					'the system rejects the creation with a "Wrong raw value type" error',
					() => {
						expect(error).toBeDefined();
						expect(error?.message).toBe('Wrong raw value type');
					},
				);

				And('no CommunityCreated event is emitted', () => {
					const event = community
						?.getIntegrationEvents()
						.find(
							(e: DomainSeedwork.DomainEvent) =>
								e.aggregateId === community?.id &&
								e instanceof CommunityCreatedEvent,
						) as CommunityCreatedEvent;
					expect(event).toBeUndefined();
				});
			},
		);

		Scenario(
			'Creating a community without providing a name',
			({ When, Then, And }) => {
				When(
					'the user attempts to create a community without providing a name',
					() => {
						props = {
							id: '123',
							createdAt: new Date(),
							updatedAt: new Date(),
							schemaVersion: '1.0',
						} as CommunityProps;
						createdBy = { displayName: 'Test User' } as EndUserEntityReference;
						name = undefined;
						try {

							community = Community.getNewInstance(
								props,
								// @ts-expect-error: testing null assignment not allowed    
								name,
								createdBy,
								passport,
							);
						} catch (e) {
							error = e as Error;
						}
					},
				);

				Then(
					'the system rejects the creation with a "Wrong raw value type" error',
					() => {
						expect(error).toBeDefined();
						expect(error?.message).toBe('Wrong raw value type');
					},
				);

				And('no CommunityCreated event is emitted', () => {
					const event = community
						?.getIntegrationEvents()
						.find(
							(e: DomainSeedwork.DomainEvent) =>
								e.aggregateId === community?.id &&
								e instanceof CommunityCreatedEvent,
						) as CommunityCreatedEvent;
					expect(event).toBeUndefined();
				});
			},
		);

		Scenario(
			'Creating a community with a name containing leading and trailing whitespace',
			({ When, Then, And }) => {
				When(
					'the user attempts to create a community with a name containing leading and trailing whitespace',
					() => {
						props = {
							id: '123',
							createdAt: new Date(),
							updatedAt: new Date(),
							schemaVersion: '1.0',
						} as CommunityProps;
						createdBy = { displayName: 'Test User' } as EndUserEntityReference;
						name = '   valid-community-name   ';
						try {
							community = Community.getNewInstance(
								props,
								name,
								createdBy,
								passport,
							);
						} catch (e) {
							error = e as Error;
						}
					},
				);

				Then('the community is created successfully', () => {
					expect(community).toBeDefined();
					expect(community).toBeInstanceOf(Community);
				});

				And('the community name is trimmed of whitespace', () => {
					expect(community?.name).toBe('valid-community-name');
				});

				And('a CommunityCreated event is emitted', () => {
					event = community
						?.getIntegrationEvents()
						.find(
							(e: DomainSeedwork.DomainEvent) =>
								e.aggregateId === community?.id &&
								e instanceof CommunityCreatedEvent,
						) as CommunityCreatedEvent;
					expect(event).toBeDefined();
					expect(event).toBeInstanceOf(CommunityCreatedEvent);
					expect(event.aggregateId).toBe(community?.id);
					expect(event.payload).toEqual({
						communityId: community?.id,
					});
				});
			},
		);

		Scenario(
			'Creating a community with an empty creator',
			({ When, Then, And }) => {
				When(
					'the user attempts to create a community with an empty creator',
					() => {
						props = {
							id: '123',
							createdAt: new Date(),
							updatedAt: new Date(),
							schemaVersion: '1.0',
						} as CommunityProps;
						name = 'valid-community-name';
						try {
							// @ts-expect-error: testing null assignment not allowed
							community = Community.getNewInstance(props, name, null, passport);
						} catch (e) {
							error = e as Error;
						}
					},
				);

				Then(
					'the system rejects the creation with a "createdBy cannot be null or undefined" error',
					() => {
						expect(error).toBeDefined();
						expect(error?.message).toBe(
							'createdBy cannot be null or undefined',
						);
					},
				);

				And('no CommunityCreated event is emitted', () => {
					const event = community
						?.getIntegrationEvents()
						.find(
							(e: DomainSeedwork.DomainEvent) =>
								e.aggregateId === community?.id &&
								e instanceof CommunityCreatedEvent,
						) as CommunityCreatedEvent;
					expect(event).toBeUndefined();
				});
			},
		);

		Scenario(
			'Creating a community without providing a creator',
			({ When, Then, And }) => {
				When(
					'the user attempts to create a community without providing a creator',
					() => {
						props = {
							id: '123',
							createdAt: new Date(),
							updatedAt: new Date(),
							schemaVersion: '1.0',
						} as CommunityProps;
						name = 'valid-community-name';
						try {
							// @ts-expect-error: testing null assignment not allowed
							community = Community.getNewInstance(props, name, null, passport);
						} catch (e) {
							error = e as Error;
						}
					},
				);

				Then(
					'the system rejects the creation with a "createdBy cannot be null or undefined" error',
					() => {
						expect(error).toBeDefined();
						expect(error?.message).toBe(
							'createdBy cannot be null or undefined',
						);
					},
				);

				And('no CommunityCreated event is emitted', () => {
					const event = community
						?.getIntegrationEvents()
						.find(
							(e: DomainSeedwork.DomainEvent) =>
								e.aggregateId === community?.id &&
								e instanceof CommunityCreatedEvent,
						) as CommunityCreatedEvent;
					expect(event).toBeUndefined();
				});
			},
		);

		Scenario(
			'Creating a community without permission',
			({ Given, When, Then, And }) => {
				let community: Community<CommunityProps> | undefined;
				Given('a user without permission to create communities', () => {
					passport = getMockedPassport({ canCreateCommunities: false });
				});

				When(
					'the user attempts to create a community with valid details',
					() => {
						props = {
							id: '123',
							createdAt: new Date(),
							updatedAt: new Date(),
							schemaVersion: '1.0',
						} as CommunityProps;
						createdBy = { displayName: 'Test User' } as EndUserEntityReference;
						name = 'valid-community-name';
						try {
							community = Community.getNewInstance(
								props,
								name,
								createdBy,
								passport,
							);
						} catch (e) {
							error = e as Error;
						}
					},
				);

				Then('the system rejects the creation with a permission error', () => {
					expect(error).toBeDefined();
					expect(error?.message).toBe(
						'You do not have permission to create communities',
					);
				});

				And('no CommunityCreated event is emitted', () => {
					event = community
						?.getIntegrationEvents()
						.find(
							(e) =>
								e instanceof CommunityCreatedEvent &&
								e.aggregateId === community?.id,
						) as CommunityCreatedEvent;
					expect(event).toBeUndefined();
				});
			},
		);
	},
);

describeFeature(
	communityManagementFeature,
	({ Scenario, Background, BeforeEachScenario }) => {
		let community: Community<CommunityProps>;
		let props: CommunityProps;
		let passport: Passport;
		let error: Error | undefined;
		let event:
			| CommunityDomainUpdatedEvent
			| CommunityWhiteLabelDomainUpdatedEvent
			| undefined;
		let originalName: string;
		let originalDomain: string;
		let originalWhiteLabelDomain: string | null;
		let originalHandle: string | null;

		BeforeEachScenario(() => {
			originalName = 'existing-community';
			originalDomain = 'old-domain.com';
			originalWhiteLabelDomain = 'old-white-label.com';
			originalHandle = 'old-handle';
			props = {
				id: '123',
				name: originalName,
				domain: originalDomain,
				whiteLabelDomain: originalWhiteLabelDomain,
				handle: originalHandle,
				createdBy: { displayName: 'Test User' } as EndUserEntityReference,
				createdAt: new Date(),
				updatedAt: new Date(),
				schemaVersion: '1.0',
			} as CommunityProps;
			passport = getMockedPassport({ canManageCommunitySettings: true });
			community = new Community(props, passport);
			error = undefined;
			event = undefined;
		});

		Background(({ Given, And }) => {
			Given('a user with the permission to manage community settings', () => {
				passport = getMockedPassport({ canManageCommunitySettings: true });
			});
			And('an existing community', () => {
				props = {
					id: '123',
					name: originalName,
					domain: originalDomain,
					whiteLabelDomain: originalWhiteLabelDomain,
					handle: originalHandle,
					createdBy: { displayName: 'Test User' } as EndUserEntityReference,
					createdAt: new Date(),
					updatedAt: new Date(),
					schemaVersion: '1.0',
				} as CommunityProps;
				community = new Community(props, passport);
			});
		});

		// --- Name scenarios ---
		Scenario(
			'Renaming the community with a valid new value',
			({ When, Then }) => {
				When('the user renames the community to a valid new name', () => {
					try {
						community.name = 'new-community-name';
					} catch (e) {
						error = e as Error;
					}
				});
				Then('the community name is updated', () => {
					expect(community.name).toBe('new-community-name');
				});
			},
		);

		Scenario(
			'Renaming the community to a name at maximum length',
			({ When, Then }) => {
				When(
					'the user renames the community to a name of exactly 200 characters',
					() => {
						try {
							community.name = 'a'.repeat(200);
						} catch (e) {
							error = e as Error;
						}
					},
				);
				Then('the community name is updated', () => {
					expect(community.name).toBe('a'.repeat(200));
				});
			},
		);

		Scenario(
			'Renaming the community to a name at minimum length',
			({ When, Then }) => {
				When(
					'the user renames the community to a name of exactly 1 character',
					() => {
						try {
							community.name = 'x';
						} catch (e) {
							error = e as Error;
						}
					},
				);
				Then('the community name is updated', () => {
					expect(community.name).toBe('x');
				});
			},
		);

		Scenario(
			'Renaming the community to a name that is too long',
			({ When, Then }) => {
				When(
					'the user renames the community to a name longer than 200 characters',
					() => {
						try {
							community.name = 'a'.repeat(201);
						} catch (e) {
							error = e as Error;
						}
					},
				);
				Then(
					'the system rejects the name change with a "Too long" error',
					() => {
						expect(error).toBeDefined();
						expect(error?.message).toBe('Too long');
					},
				);
			},
		);

		Scenario(
			'Renaming the community to a name that is too short',
			({ When, Then }) => {
				When(
					'the user renames the community to a name shorter than 1 character',
					() => {
						try {
							community.name = '';
						} catch (e) {
							error = e as Error;
						}
					},
				);
				Then(
					'the system rejects the name change with a "Too short" error',
					() => {
						expect(error).toBeDefined();
						expect(error?.message).toBe('Too short');
					},
				);
			},
		);

		Scenario('Renaming the community to clear the name', ({ When, Then }) => {
			When('the user renames the community to clear the name', () => {
				try {
					// @ts-expect-error: testing null assignment not allowed
					community.name = null;
				} catch (e) {
					error = e as Error;
				}
			});
			Then(
				'the system rejects the name change with a "Wrong raw value type" error',
				() => {
					expect(error).toBeDefined();
					expect(error?.message).toBe('Wrong raw value type');
				},
			);
		});

		Scenario(
			'Renaming the community without providing a name',
			({ When, Then }) => {
				When('the user renames the community without providing a name', () => {
					try {
						// @ts-expect-error: testing undefined assignment not allowed
						community.name = undefined;
					} catch (e) {
						error = e as Error;
					}
				});
				Then(
					'the system rejects the name change with a "Wrong raw value type" error',
					() => {
						expect(error).toBeDefined();
						expect(error?.message).toBe('Wrong raw value type');
					},
				);
			},
		);

		Scenario('Renaming the community to the same name', ({ When, Then }) => {
			When('the user renames the community to the current name', () => {
				try {
					community.name = originalName;
				} catch (e) {
					error = e as Error;
				}
			});
			Then('the community name remains unchanged', () => {
				expect(community.name).toBe(originalName);
			});
		});

		Scenario(
			'Renaming the community to a name with leading and trailing whitespace',
			({ When, Then, And }) => {
				When(
					'the user renames the community to a name with leading and trailing whitespace',
					() => {
						try {
							community.name = '   new-community-name   ';
						} catch (e) {
							error = e as Error;
						}
					},
				);
				Then('the community name is updated', () => {
					expect(community.name).toBe('new-community-name');
				});
				And('the community name is trimmed of whitespace', () => {
					expect(community.name).toBe('new-community-name');
				});
			},
		);

		Scenario(
			'Renaming the community without permission',
			({ Given, When, Then, And }) => {
				Given('a user without permission to manage community settings', () => {
					passport = getMockedPassport({ canManageCommunitySettings: false });
					community = new Community(props, passport);
				});
				When('the user renames the community to a valid new name', () => {
					try {
						community.name = 'new-community-name';
					} catch (e) {
						error = e as Error;
					}
				});
				Then(
					'the system rejects the name change with a permission error',
					() => {
						expect(error).toBeDefined();
						expect(error?.message).toBe(
							'You do not have permission to change the name of this community',
						);
					},
				);
				And('the community name remains unchanged', () => {
					expect(community.name).toBe(originalName);
				});
			},
		);

		// --- Domain scenarios ---
		Scenario(
			'Changing the community domain to a valid new value',
			({ When, Then, And }) => {
				When(
					'the user changes the community domain to a valid new domain',
					() => {
						try {
							community.domain = 'new-domain.com';
						} catch (e) {
							error = e as Error;
						}
					},
				);
				Then('the community domain is updated', () => {
					expect(community.domain).toBe('new-domain.com');
				});
				And('a CommunityDomainUpdated event is emitted', () => {
					expectEventEmitted(community, CommunityDomainUpdatedEvent, (event) => {
						expect(event.payload.domain).toBe('new-domain.com');
						expect(event.payload.oldDomain).toBe(originalDomain);
					});
				});
			},
		);

		Scenario(
			'Changing the community domain to a value at maximum length',
			({ When, Then, And }) => {
				When(
					'the user changes the community domain to a domain of exactly 500 characters',
					() => {
						try {
							community.domain = 'd'.repeat(500);
						} catch (e) {
							error = e as Error;
						}
					},
				);
				Then('the community domain is updated', () => {
					expect(community.domain).toBe('d'.repeat(500));
				});
				And('a CommunityDomainUpdated event is emitted', () => {
					event = community
						.getIntegrationEvents()
						.find(
							(e) =>
								e.aggregateId === community.id &&
								e instanceof CommunityDomainUpdatedEvent,
						) as CommunityDomainUpdatedEvent;
					expect(event).toBeDefined();
					expect(event?.payload.domain).toBe('d'.repeat(500));
					expect(event?.payload.oldDomain).toBe(originalDomain);
				});
			},
		);

		Scenario(
			'Changing the community domain to a value at minimum length',
			({ When, Then, And }) => {
				When(
					'the user changes the community domain to a domain of exactly 1 character',
					() => {
						try {
							community.domain = 'x';
						} catch (e) {
							error = e as Error;
						}
					},
				);
				Then('the community domain is updated', () => {
					expect(community.domain).toBe('x');
				});
				And('a CommunityDomainUpdated event is emitted', () => {
					event = community
						.getIntegrationEvents()
						.find(
							(e) =>
								e.aggregateId === community.id &&
								e instanceof CommunityDomainUpdatedEvent,
						) as CommunityDomainUpdatedEvent;
					expect(event).toBeDefined();
					expect(event?.payload.domain).toBe('x');
					expect(event?.payload.oldDomain).toBe(originalDomain);
				});
			},
		);

		Scenario(
			'Changing the community domain to a value that is too long',
			({ When, Then, And }) => {
				When(
					'the user changes the community domain to a domain longer than 500 characters',
					() => {
						try {
							community.domain = 'd'.repeat(501);
						} catch (e) {
							error = e as Error;
						}
					},
				);
				Then(
					'the system rejects the domain change with a "Too long" error',
					() => {
						expect(error).toBeDefined();
						expect(error?.message).toBe('Too long');
					},
				);
				And('no CommunityDomainUpdated event is emitted', () => {
					expectNoEventEmitted(community, CommunityDomainUpdatedEvent);
				});
			},
		);

		Scenario(
			'Changing the community domain to a value that is too short',
			({ When, Then, And }) => {
				When(
					'the user changes the community domain to a domain shorter than 1 character',
					() => {
						try {
							community.domain = '';
						} catch (e) {
							error = e as Error;
						}
					},
				);
				Then(
					'the system rejects the domain change with a "Too short" error',
					() => {
						expect(error).toBeDefined();
						expect(error?.message).toBe('Too short');
					},
				);
				And('no CommunityDomainUpdated event is emitted', () => {
					event = community
						.getIntegrationEvents()
						.find(
							(e) =>
								e.aggregateId === community.id &&
								e instanceof CommunityDomainUpdatedEvent,
						) as CommunityDomainUpdatedEvent;
					expect(event).toBeUndefined();
				});
			},
		);

		Scenario(
			'Changing the community domain to clear the domain',
			({ When, Then, And }) => {
				When(
					'the user changes the community domain to clear the domain',
					() => {
						try {
							// @ts-expect-error: testing null assignment not allowed
							community.domain = null;
						} catch (e) {
							error = e as Error;
						}
					},
				);
				Then(
					'the system rejects the domain change with a "Wrong raw value type" error',
					() => {
						expect(error).toBeDefined();
						expect(error?.message).toBe('Wrong raw value type');
					},
				);
				And('no CommunityDomainUpdated event is emitted', () => {
					event = community
						.getIntegrationEvents()
						.find(
							(e) =>
								e.aggregateId === community.id &&
								e instanceof CommunityDomainUpdatedEvent,
						) as CommunityDomainUpdatedEvent;
					expect(event).toBeUndefined();
				});
			},
		);

		Scenario(
			'Changing the community domain without providing a domain',
			({ When, Then, And }) => {
				When(
					'the user changes the community domain without providing a domain',
					() => {
						try {
							// @ts-expect-error: testing undefined assignment not allowed
							community.domain = undefined;
						} catch (e) {
							error = e as Error;
						}
					},
				);
				Then(
					'the system rejects the domain change with a "Wrong raw value type" error',
					() => {
						expect(error).toBeDefined();
						expect(error?.message).toBe('Wrong raw value type');
					},
				);
				And('no CommunityDomainUpdated event is emitted', () => {
					event = community
						.getIntegrationEvents()
						.find(
							(e) =>
								e.aggregateId === community.id &&
								e instanceof CommunityDomainUpdatedEvent,
						) as CommunityDomainUpdatedEvent;
					expect(event).toBeUndefined();
				});
			},
		);

		Scenario(
			'Changing the community domain to the same domain',
			({ When, Then, And }) => {
				When(
					'the user changes the community domain to the current domain',
					() => {
						try {
							community.domain = originalDomain;
						} catch (e) {
							error = e as Error;
						}
					},
				);
				Then('the community domain remains unchanged', () => {
					expect(community.domain).toBe(originalDomain);
				});
				And('no CommunityDomainUpdated event is emitted', () => {
					event = community
						.getIntegrationEvents()
						.find(
							(e) =>
								e.aggregateId === community.id &&
								e instanceof CommunityDomainUpdatedEvent,
						) as CommunityDomainUpdatedEvent;
					expect(event).toBeUndefined();
				});
			},
		);

		Scenario(
			'Changing the community domain to a domain with leading and trailing whitespace',
			({ When, Then, And }) => {
				When(
					'the user changes the community domain to a domain with leading and trailing whitespace',
					() => {
						try {
							community.domain = '   new-domain.com   ';
						} catch (e) {
							error = e as Error;
						}
					},
				);
				Then('the community domain is updated', () => {
					expect(community.domain).toBe('new-domain.com');
				});
				And('the community domain is trimmed of whitespace', () => {
					expect(community.domain).toBe('new-domain.com');
				});
				And('a CommunityDomainUpdated event is emitted', () => {
					event = community
						.getIntegrationEvents()
						.find(
							(e) =>
								e.aggregateId === community.id &&
								e instanceof CommunityDomainUpdatedEvent,
						) as CommunityDomainUpdatedEvent;
					expect(event).toBeDefined();
					expect(event?.payload.domain).toBe('new-domain.com');
					expect(event?.payload.oldDomain).toBe(originalDomain);
				});
			},
		);

		Scenario(
			'Changing the community domain without permission',
			({ Given, When, Then, And }) => {
				Given('a user without permission to manage community settings', () => {
					passport = getMockedPassport({ canManageCommunitySettings: false });
					community = new Community(props, passport);
				});
				When(
					'the user changes the community domain to a valid new domain',
					() => {
						try {
							community.domain = 'new-domain.com';
						} catch (e) {
							error = e as Error;
						}
					},
				);
				Then(
					'the system rejects the domain change with a permission error',
					() => {
						expect(error).toBeDefined();
						expect(error?.message).toBe(
							'You do not have permission to change the domain of this community',
						);
					},
				);
				And('no CommunityDomainUpdated event is emitted', () => {
					event = community
						.getIntegrationEvents()
						.find(
							(e) =>
								e.aggregateId === community.id &&
								e instanceof CommunityDomainUpdatedEvent,
						) as CommunityDomainUpdatedEvent;
					expect(event).toBeUndefined();
				});
			},
		);

		// --- White label domain scenarios ---
		Scenario(
			'Changing the white label domain to a valid new value',
			({ When, Then, And }) => {
				When(
					'the user changes the white label domain to a valid new value',
					() => {
						try {
							community.whiteLabelDomain = 'new-white-label.com';
						} catch (e) {
							error = e as Error;
						}
					},
				);
				Then('the white label domain is updated', () => {
					expect(community.whiteLabelDomain).toBe('new-white-label.com');
				});
				And('a CommunityWhiteLabelDomainUpdated event is emitted', () => {
					expectEventEmitted(community, CommunityWhiteLabelDomainUpdatedEvent, (event) => {
						expect(event.payload.whiteLabelDomain).toBe('new-white-label.com');
						expect(event.payload.oldWhiteLabelDomain).toBe(originalWhiteLabelDomain);
					});
				});
			},
		);

		Scenario(
			'Changing the white label domain to a value at maximum length',
			({ When, Then, And }) => {
				When(
					'the user changes the white label domain to a value of exactly 500 characters',
					() => {
						try {
							community.whiteLabelDomain = 'w'.repeat(500);
						} catch (e) {
							error = e as Error;
						}
					},
				);
				Then('the white label domain is updated', () => {
					expect(community.whiteLabelDomain).toBe('w'.repeat(500));
				});
				And('a CommunityWhiteLabelDomainUpdated event is emitted', () => {
					event = community
						.getIntegrationEvents()
						.find(
							(e) =>
								e.aggregateId === community.id &&
								e instanceof CommunityWhiteLabelDomainUpdatedEvent,
						) as CommunityWhiteLabelDomainUpdatedEvent;
					expect(event).toBeDefined();
					expect(event?.payload.whiteLabelDomain).toBe('w'.repeat(500));
					expect(event?.payload.oldWhiteLabelDomain).toBe(
						originalWhiteLabelDomain,
					);
				});
			},
		);

		Scenario(
			'Changing the white label domain to a value at minimum length',
			({ When, Then, And }) => {
				When(
					'the user changes the white label domain to a value of exactly 1 character',
					() => {
						try {
							community.whiteLabelDomain = 'x';
						} catch (e) {
							error = e as Error;
						}
					},
				);
				Then('the white label domain is updated', () => {
					expect(community.whiteLabelDomain).toBe('x');
				});
				And('a CommunityWhiteLabelDomainUpdated event is emitted', () => {
					event = community
						.getIntegrationEvents()
						.find(
							(e) =>
								e.aggregateId === community.id &&
								e instanceof CommunityWhiteLabelDomainUpdatedEvent,
						) as CommunityWhiteLabelDomainUpdatedEvent;
					expect(event).toBeDefined();
					expect(event?.payload.whiteLabelDomain).toBe('x');
					expect(event?.payload.oldWhiteLabelDomain).toBe(
						originalWhiteLabelDomain,
					);
				});
			},
		);

		Scenario(
			'Changing the white label domain to a value that is too long',
			({ When, Then, And }) => {
				When(
					'the user changes the white label domain to a value longer than 500 characters',
					() => {
						try {
							community.whiteLabelDomain = 'w'.repeat(501);
						} catch (e) {
							error = e as Error;
						}
					},
				);
				Then(
					'the system rejects the white label domain change with a "Too long" error',
					() => {
						expect(error).toBeDefined();
						expect(error?.message).toBe('Too long');
					},
				);
				And('no CommunityWhiteLabelDomainUpdated event is emitted', () => {
					expectNoEventEmitted(community, CommunityWhiteLabelDomainUpdatedEvent);
				});
			},
		);

		Scenario(
			'Changing the white label domain to a value that is too short',
			({ When, Then, And }) => {
				When(
					'the user changes the white label domain to a value shorter than 1 character',
					() => {
						try {
							community.whiteLabelDomain = '';
						} catch (e) {
							error = e as Error;
						}
					},
				);
				Then(
					'the system rejects the white label domain change with a "Too short" error',
					() => {
						expect(error).toBeDefined();
						expect(error?.message).toBe('Too short');
					},
				);
				And('no CommunityWhiteLabelDomainUpdated event is emitted', () => {
					event = community
						.getIntegrationEvents()
						.find(
							(e) =>
								e.aggregateId === community.id &&
								e instanceof CommunityWhiteLabelDomainUpdatedEvent,
						) as CommunityWhiteLabelDomainUpdatedEvent;
					expect(event).toBeUndefined();
				});
			},
		);

		Scenario('Clearing the white label domain', ({ When, Then, And }) => {
			When('the user clears the white label domain', () => {
				try {
					community.whiteLabelDomain = null;
				} catch (e) {
					error = e as Error;
				}
			});
			Then('the white label domain is cleared', () => {
				expect(community.whiteLabelDomain).toBeNull();
			});
			And('a CommunityWhiteLabelDomainUpdated event is emitted', () => {
				event = community
					.getIntegrationEvents()
					.find(
						(e) =>
							e.aggregateId === community.id &&
							e instanceof CommunityWhiteLabelDomainUpdatedEvent,
					) as CommunityWhiteLabelDomainUpdatedEvent;
				expect(event).toBeDefined();
				expect(event?.payload.whiteLabelDomain).toBeNull();
				expect(event?.payload.oldWhiteLabelDomain).toBe(
					originalWhiteLabelDomain,
				);
			});
		});

		Scenario(
			'Changing the white label domain without providing a white label domain',
			({ When, Then, And }) => {
				When(
					'the user changes the white label domain without providing a white label domain',
					() => {
						try {
							// @ts-expect-error
							community.whiteLabelDomain = undefined;
						} catch (e) {
							error = e as Error;
						}
					},
				);
				Then(
					'the system rejects the white label domain change with a "Wrong raw value type" error',
					() => {
						expect(error).toBeDefined();
						expect(error?.message).toBe('Wrong raw value type');
					},
				);
				And('no CommunityWhiteLabelDomainUpdated event is emitted', () => {
					event = community
						.getIntegrationEvents()
						.find(
							(e) =>
								e.aggregateId === community.id &&
								e instanceof CommunityWhiteLabelDomainUpdatedEvent,
						) as CommunityWhiteLabelDomainUpdatedEvent;
					expect(event).toBeUndefined();
				});
			},
		);

		Scenario(
			'Changing the white label domain to the same value',
			({ When, Then, And }) => {
				When(
					'the user changes the white label domain to the current value',
					() => {
						try {
							community.whiteLabelDomain = originalWhiteLabelDomain;
						} catch (e) {
							error = e as Error;
						}
					},
				);
				Then('the white label domain remains unchanged', () => {
					expect(community.whiteLabelDomain).toBe(originalWhiteLabelDomain);
				});
				And('no CommunityWhiteLabelDomainUpdated event is emitted', () => {
					event = community
						.getIntegrationEvents()
						.find(
							(e) =>
								e.aggregateId === community.id &&
								e instanceof CommunityWhiteLabelDomainUpdatedEvent,
						) as CommunityWhiteLabelDomainUpdatedEvent;
					expect(event).toBeUndefined();
				});
			},
		);

		Scenario(
			'Changing the white label domain to a value with leading and trailing whitespace',
			({ When, Then, And }) => {
				When(
					'the user changes the white label domain to a value with leading and trailing whitespace',
					() => {
						try {
							community.whiteLabelDomain = '   new-white-label.com   ';
						} catch (e) {
							error = e as Error;
						}
					},
				);
				Then('the white label domain is updated', () => {
					expect(community.whiteLabelDomain).toBe('new-white-label.com');
				});
				And('the white label domain is trimmed of whitespace', () => {
					expect(community.whiteLabelDomain).toBe('new-white-label.com');
				});
				And('a CommunityWhiteLabelDomainUpdated event is emitted', () => {
					event = community
						.getIntegrationEvents()
						.find(
							(e) =>
								e.aggregateId === community.id &&
								e instanceof CommunityWhiteLabelDomainUpdatedEvent,
						) as CommunityWhiteLabelDomainUpdatedEvent;
					expect(event).toBeDefined();
					expect(event?.payload.whiteLabelDomain).toBe('new-white-label.com');
					expect(event?.payload.oldWhiteLabelDomain).toBe(
						originalWhiteLabelDomain,
					);
				});
			},
		);

		Scenario(
			'Changing the white label domain without permission',
			({ Given, When, Then, And }) => {
				Given('a user without permission to manage community settings', () => {
					passport = getMockedPassport({ canManageCommunitySettings: false });
					community = new Community(props, passport);
				});
				When(
					'the user changes the white label domain to a valid new value',
					() => {
						try {
							community.whiteLabelDomain = 'new-white-label.com';
						} catch (e) {
							error = e as Error;
						}
					},
				);
				Then(
					'the system rejects the white label domain change with a permission error',
					() => {
						expect(error).toBeDefined();
						expect(error?.message).toBe(
							'You do not have permission to change the white label domain of this community',
						);
					},
				);
				And('no CommunityWhiteLabelDomainUpdated event is emitted', () => {
					event = community
						.getIntegrationEvents()
						.find(
							(e) =>
								e.aggregateId === community.id &&
								e instanceof CommunityWhiteLabelDomainUpdatedEvent,
						) as CommunityWhiteLabelDomainUpdatedEvent;
					expect(event).toBeUndefined();
				});
			},
		);

		// --- Handle scenarios ---
		Scenario(
			'Changing the community handle to a valid new handle',
			({ When, Then }) => {
				When(
					'the user changes the community handle to a valid new handle',
					() => {
						try {
							community.handle = 'new-handle';
						} catch (e) {
							error = e as Error;
						}
					},
				);
				Then('the community handle is updated', () => {
					expect(community.handle).toBe('new-handle');
				});
			},
		);

		Scenario(
			'Changing the community handle to a value at maximum length',
			({ When, Then }) => {
				When(
					'the user changes the community handle to a value of exactly 50 characters',
					() => {
						try {
							community.handle = 'h'.repeat(50);
						} catch (e) {
							error = e as Error;
						}
					},
				);
				Then('the community handle is updated', () => {
					expect(community.handle).toBe('h'.repeat(50));
				});
			},
		);

		Scenario(
			'Changing the community handle to a value at minimum length',
			({ When, Then }) => {
				When(
					'the user changes the community handle to a value of exactly 1 character',
					() => {
						try {
							community.handle = 'h';
						} catch (e) {
							error = e as Error;
						}
					},
				);
				Then('the community handle is updated', () => {
					expect(community.handle).toBe('h');
				});
			},
		);

		Scenario(
			'Changing the community handle to a value that is too long',
			({ When, Then }) => {
				When(
					'the user changes the community handle to a value longer than 50 characters',
					() => {
						try {
							community.handle = 'h'.repeat(51);
						} catch (e) {
							error = e as Error;
						}
					},
				);
				Then(
					'the system rejects the handle change with a "Too long" error',
					() => {
						expect(error).toBeDefined();
						expect(error?.message).toBe('Too long');
					},
				);
			},
		);

		Scenario(
			'Changing the community handle to a value that is too short',
			({ When, Then }) => {
				When(
					'the user changes the community handle to a value shorter than 1 character',
					() => {
						try {
							community.handle = '';
						} catch (e) {
							error = e as Error;
						}
					},
				);
				Then(
					'the system rejects the handle change with a "Too short" error',
					() => {
						expect(error).toBeDefined();
						expect(error?.message).toBe('Too short');
					},
				);
			},
		);

		Scenario('Clearing the community handle', ({ When, Then }) => {
			When('the user clears the community handle', () => {
				try {
					community.handle = null;
				} catch (e) {
					error = e as Error;
				}
			});
			Then('the community handle is cleared', () => {
				expect(community.handle).toBeNull();
			});
		});

		Scenario(
			'Changing the community handle without providing a handle',
			({ When, Then }) => {
				When(
					'the user changes the community handle without providing a handle',
					() => {
						try {
							// @ts-expect-error: testing undefined assignment not allowed
							community.handle = undefined;
						} catch (e) {
							error = e as Error;
						}
					},
				);
				Then(
					'the system rejects the handle change with a "Wrong raw value type" error',
					() => {
						expect(error).toBeDefined();
						expect(error?.message).toBe('Wrong raw value type');
					},
				);
			},
		);

		Scenario(
			'Changing the community handle to the same handle',
			({ When, Then }) => {
				When(
					'the user changes the community handle to the current handle',
					() => {
						try {
							community.handle = originalHandle;
						} catch (e) {
							error = e as Error;
						}
					},
				);
				Then('the community handle remains unchanged', () => {
					expect(community.handle).toBe(originalHandle);
				});
			},
		);

		Scenario(
			'Changing the community handle to a handle with leading and trailing whitespace',
			({ When, Then, And }) => {
				When(
					'the user changes the community handle to a handle with leading and trailing whitespace',
					() => {
						try {
							community.handle = '   new-handle   ';
						} catch (e) {
							error = e as Error;
						}
					},
				);
				Then('the community handle is updated', () => {
					expect(community.handle).toBe('new-handle');
				});
				And('the community handle is trimmed of whitespace', () => {
					expect(community.handle).toBe('new-handle');
				});
			},
		);

		Scenario(
			'Changing the community handle without permission',
			({ Given, When, Then, And }) => {
				Given('a user without permission to manage community settings', () => {
					passport = getMockedPassport({ canManageCommunitySettings: false });
					community = new Community(props, passport);
				});
				When(
					'the user changes the community handle to a valid new handle',
					() => {
						try {
							community.handle = 'new-handle';
						} catch (e) {
							error = e as Error;
						}
					},
				);
				Then(
					'the system rejects the handle change with a permission error',
					() => {
						expect(error).toBeDefined();
						expect(error?.message).toBe(
							'You do not have permission to change the handle of this community',
						);
					},
				);
				And('the community handle remains unchanged', () => {
					expect(community.handle).toBe(originalHandle);
				});
			},
		);
	},
);
