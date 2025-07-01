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
import { describeFeature, loadFeature, beforeEachScemario } from '@amiceli/vitest-cucumber';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const communityCreationFeature = await loadFeature(
  path.join(__dirname, 'features/community-creation.feature')
);
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

describeFeature(communityCreationFeature, ({ Scenario, Background }) => {
    let community: Community<CommunityProps> | undefined;
    let props: CommunityProps | undefined;
    let passport: Passport;
    let createdBy: EndUserEntityReference | undefined;
    let error: Error | undefined;
    let name: string | undefined;
    let event: CommunityCreatedEvent | undefined;

    const beforeEachScenario = () => {
        community = undefined;
        props = undefined;
        createdBy = undefined;
        error = undefined;
        name = undefined;
        event = undefined;
    };

    Background(({ Given }) => {
        Given('a user with the permission to create communities', () => {
            passport = getMockedPassport({ canCreateCommunities: true });
        });
    });

    
     Scenario('Creating a new community with valid details', ({ When, Then, And }) => {
        beforeEachScenario();
        When('the user creates a community with a valid name and creator', () => {
            props = {
                id: '123',
                createdAt: new Date(),
                updatedAt: new Date(),
                schemaVersion: '1.0',
            } as CommunityProps;
            createdBy = { displayName: 'Test User' } as EndUserEntityReference;
            name = 'valid-community-name';
            try {
                community = Community.getNewInstance(props, name, createdBy, passport);
            } catch (e) {
                error = e as Error;
            }
        });

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
                        e instanceof CommunityCreatedEvent
                ) as CommunityCreatedEvent;
            expect(event).toBeDefined();
            expect(event).toBeInstanceOf(CommunityCreatedEvent);
            expect(event.aggregateId).toBe(community?.id);
            expect(event.payload).toEqual({
                communityId: community?.id,
            });
        });
    });

    Scenario('Creating a community with a name that is too long', ({ When, Then, And }) => {
        beforeEachScenario();
        let community: Community<CommunityProps> | undefined;
        When('the user attempts to create a community with a name longer than 200 characters', () => {
            props = {
                id: '123',
                createdAt: new Date(),
                updatedAt: new Date(),
                schemaVersion: '1.0',
            } as CommunityProps;
            createdBy = { displayName: 'Test User' } as EndUserEntityReference;
            name = 'a'.repeat(201);
            try {
                community = Community.getNewInstance(props, name, createdBy, passport);
            } catch (e) {
                error = e as Error;
            }
        });

        Then('the system rejects the creation with a "Too long" error', () => {
            expect(error).toBeDefined();
            expect(error?.message).toBe('Too long');
        });

        And('no CommunityCreated event is emitted', () => {
            const event = community
                ?.getIntegrationEvents()
                .find(
                    (e: DomainSeedwork.DomainEvent) =>
                        e.aggregateId === community?.id &&
                        e instanceof CommunityCreatedEvent
                ) as CommunityCreatedEvent;
            expect(event).toBeUndefined();
        });
    });

    Scenario('Creating a community with a name that is too short', ({ When, Then }) => {
        beforeEachScenario();
        When('the user attempts to create a community with an empty name', () => {
            props = {
                id: '123',
                createdAt: new Date(),
                updatedAt: new Date(),
                schemaVersion: '1.0',
            } as CommunityProps;
            createdBy = { displayName: 'Test User' } as EndUserEntityReference;
            name = '';
            try {
                community = Community.getNewInstance(props, name, createdBy, passport);
            } catch (e) {
                error = e as Error;
            }
        });

        Then('the system rejects the creation with a "Too short" error', () => {
            expect(error).toBeDefined();
            expect(error?.message).toBe('Too short');
        });
    });

    Scenario('Creating a community without providing a name', ({ When, Then }) => {
        beforeEachScenario();
        When('the user attempts to create a community without providing a name', () => {
            props = {
                id: '123',
                createdAt: new Date(),
                updatedAt: new Date(),
                schemaVersion: '1.0',
            } as CommunityProps;
            createdBy = { displayName: 'Test User' } as EndUserEntityReference;
            name = undefined;
            try {
                // @ts-expect-error: testing null assignment not allowed
                community = Community.getNewInstance(props, name, createdBy, passport);
            } catch (e) {
                error = e as Error;
            }
        });

        Then('the system rejects the creation with a "Wrong raw value type" error', () => {
            expect(error).toBeDefined();
            expect(error?.message).toBe('Wrong raw value type');
        });
    });

        Scenario('Creating a community with a name containing leading and trailing whitespace', ({ When, Then, And }) => {
            beforeEachScenario();
        When('the user attempts to create a community with a name containing leading and trailing whitespace', () => {
            props = {
                id: '123',
                createdAt: new Date(),
                updatedAt: new Date(),
                schemaVersion: '1.0',
            } as CommunityProps;
            createdBy = { displayName: 'Test User' } as EndUserEntityReference;
            name = '   valid-community-name   ';
            try {
                community = Community.getNewInstance(props, name, createdBy, passport);
            } catch (e) {
                error = e as Error;
            }
        });

        Then('the community is created successfully', () => {
            expect(community).toBeDefined();
            expect(community).toBeInstanceOf(Community);
        });

        And('the community name is trimmed of whitespace', () => {
            expect(community?.name).toBe('valid-community-name');
        });
    });

    Scenario('Creating a community without providing a creator', ({ When, Then }) => {
        beforeEachScenario();
        When('the user attempts to create a community without providing a creator', () => {
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
        });

        Then('the system rejects the creation with a "createdBy cannot be null or undefined" error', () => {
            expect(error).toBeDefined();
            expect(error?.message).toBe('createdBy cannot be null or undefined');
        });
    });

    Scenario('Creating a community without permission', ({ Given, When, Then, And }) => {
        beforeEachScenario();
        let community: Community<CommunityProps> | undefined;
        Given('a user without permission to create communities', () => {
            passport = getMockedPassport({ canCreateCommunities: false });
        });

        When('the user attempts to create a community', () => {
            props = {
                id: '123',
                createdAt: new Date(),
                updatedAt: new Date(),
                schemaVersion: '1.0',
            } as CommunityProps;
            createdBy = { displayName: 'Test User' } as EndUserEntityReference;
            name = 'valid-community-name';
            try {
                community = Community.getNewInstance(props, name, createdBy, passport);
            } catch (e) {
                error = e as Error;
            }
        });

        Then('the system rejects the creation with a permission error', () => {
            expect(error).toBeDefined();
            expect(error?.message).toBe('You do not have permission to create communities');
        });

        And('no CommunityCreated event is emitted', () => {
            event = community?.getIntegrationEvents().find(
                (e) => e instanceof CommunityCreatedEvent && e.aggregateId === community?.id,
            ) as CommunityCreatedEvent;
            expect(event).toBeUndefined();
        });
    });
});


// describe('domain.contexts.community::community', () => {
// 	const givenValidCommunityName = 'valid-community-name';
// 	const givenValidCreatedBy = vi.mocked({
// 		displayName: 'Test User',
// 	} as EndUserEntityReference);

// 	describe('[Aggregate] Community', () => {
// 		describe('Creating a Community', () => {
// 			let givenValidNewProps: CommunityProps;
// 			const givenValidPassport: Passport = getMockedPassport({
// 				canCreateCommunities: true,
// 			});
// 			const now = new Date();
// 			beforeEach(() => {
// 				givenValidNewProps = vi.mocked({
// 					id: '123',
// 					createdAt: now,
// 					updatedAt: now,
// 					schemaVersion: '1.0',
// 				} as CommunityProps);
// 				givenValidNewProps.createdBy = vi.mocked({} as EndUserEntityReference);
// 			});

// 			it('Given a user with valid community name, createdBy and permissions, when they attempt to create a community, it should create a new community', () => {
// 				// Arrange & Act
// 				const community = Community.getNewInstance(
// 					givenValidNewProps,
// 					givenValidCommunityName,
// 					givenValidCreatedBy,
// 					givenValidPassport,
// 				);
// 				// Assert
// 				expect(community).toBeInstanceOf(Community);
// 				expect(community.props).toEqual(givenValidNewProps);
// 				expect(community.name).toBe(givenValidCommunityName);
// 				expect(community.createdBy).toBeInstanceOf(EndUser);
// 				expect(community.createdBy.displayName).toBe(
// 					givenValidCreatedBy.displayName,
// 				);
// 				expect(community.createdAt).toBe(now);
// 				expect(community.updatedAt).toBe(now);
// 				expect(community.schemaVersion).toBe('1.0');
// 			});

// 			it('Given a user with valid community name, createdBy and permissions, when they attempt to create a community, it should emit CommunityCreatedEvent', () => {
// 				// Arrange & Act
// 				const community = Community.getNewInstance(
// 					givenValidNewProps,
// 					givenValidCommunityName,
// 					givenValidCreatedBy,
// 					givenValidPassport,
// 				);
// 				const integrationEvent = community
// 					.getIntegrationEvents()
// 					.find(
// 						(e) =>
// 							e.aggregateId === community.id &&
// 							e instanceof CommunityCreatedEvent,
// 					) as CommunityCreatedEvent;
// 				// Assert
// 				expect(integrationEvent).toBeDefined();
// 				expect(integrationEvent).toBeInstanceOf(CommunityCreatedEvent);
// 				expect(integrationEvent.aggregateId).toBe(community.id);
// 				expect(integrationEvent.payload).toEqual({
// 					communityId: community.id,
// 				});
// 			});

// 			it('Given a user with community name that is too long, when they attempt to create a community, it should throw an error', () => {
// 				// Arrange
// 				const givenInvalidName = 'a'.repeat(201);
// 				// Act
// 				const creatingInvalidCommunity = () => {
// 					Community.getNewInstance(
// 						givenValidNewProps,
// 						givenInvalidName,
// 						givenValidCreatedBy,
// 						givenValidPassport,
// 					);
// 				};
// 				// Assert
// 				expect(creatingInvalidCommunity).toThrow('Too long');
// 			});

// 			it('Given a user with community name that is too short, when they attempt to create a community, it should throw an error', () => {
// 				// Arrange
// 				const givenInvalidCommunityName = '';
// 				// Act
// 				const creatingInvalidCommunity = () => {
// 					Community.getNewInstance(
// 						givenValidNewProps,
// 						givenInvalidCommunityName,
// 						givenValidCreatedBy,
// 						givenValidPassport,
// 					);
// 				};
// 				// Assert
// 				expect(creatingInvalidCommunity).toThrow('Too short');
// 			});

// 			it('Given a user with null community name, when they attempt to create a community, it should throw an error', () => {
// 				// Arrange
// 				const givenInvalidCommunityName = null;
// 				// Act
// 				const creatingInvalidCommunity = () => {
// 					Community.getNewInstance(
// 						givenValidNewProps,
// 						// @ts-expect-error: testing null assignment not allowed
// 						givenInvalidCommunityName,
// 						givenValidCreatedBy,
// 						givenValidPassport,
// 					);
// 				};
// 				// Assert
// 				expect(creatingInvalidCommunity).toThrow('Wrong raw value type');
// 			});

// 			it('Given a user with undefined community name, when they attempt to create a community, it should throw an error', () => {
// 				// Arrange
// 				const givenInvalidCommunityName = undefined;
// 				// Act
// 				const creatingInvalidCommunity = () => {
// 					Community.getNewInstance(
// 						givenValidNewProps,
// 						// @ts-expect-error: testing null assignment not allowed
// 						givenInvalidCommunityName,
// 						givenValidCreatedBy,
// 						givenValidPassport,
// 					);
// 				};
// 				// Assert
// 				expect(creatingInvalidCommunity).toThrow('Wrong raw value type');
// 			});

// 			it('Given a user with null createdBy, when they attempt to create a community, it should throw an error', () => {
// 				// Arrange
// 				const givenInvalidCreatedBy = null;
// 				// Act
// 				const creatingInvalidCommunity = () => {
// 					Community.getNewInstance(
// 						givenValidNewProps,
// 						givenValidCommunityName,
// 						// @ts-expect-error: testing null assignment not allowed
// 						givenInvalidCreatedBy,
// 						givenValidPassport,
// 					);
// 				};
// 				// Assert
// 				expect(creatingInvalidCommunity).toThrow(
// 					'createdBy cannot be null or undefined',
// 				);
// 			});

// 			it('Given a user with undefined createdBy, when they attempt to create a community, it should throw an error', () => {
// 				// Arrange
// 				const givenInvalidCreatedBy = undefined;
// 				// Act
// 				const creatingInvalidCommunity = () => {
// 					Community.getNewInstance(
// 						givenValidNewProps,
// 						givenValidCommunityName,
// 						// @ts-expect-error: testing null assignment not allowed
// 						givenInvalidCreatedBy,
// 						givenValidPassport,
// 					);
// 				};
// 				// Assert
// 				expect(creatingInvalidCommunity).toThrow(
// 					'createdBy cannot be null or undefined',
// 				);
// 			});

// 			it('Given a user without permission to create communities, when they attempt to create a community, it should throw PermissionError', () => {
// 				// Arrange
// 				const givenInvalidPassport = getMockedPassport({
// 					canCreateCommunities: false,
// 				});
// 				// Act
// 				const creatingInvalidCommunity = () => {
// 					Community.getNewInstance(
// 						givenValidNewProps,
// 						givenValidCommunityName,
// 						givenValidCreatedBy,
// 						givenInvalidPassport,
// 					);
// 				};
// 				// Assert
// 				expect(creatingInvalidCommunity).toThrow(
// 					DomainSeedwork.PermissionError,
// 				);
// 				expect(creatingInvalidCommunity).toThrow(
// 					'You do not have permission to create communities',
// 				);
// 			});

// 			it('Given a user without permission to create communities, when they attempt to create a community, it should not emit CommunityCreatedEvent', () => {
// 				const givenInvalidPassport = getMockedPassport({
// 					canCreateCommunities: false,
// 				});
// 				// Act
// 				const creatingInvalidCommunity = () => {
// 					Community.getNewInstance(
// 						givenValidNewProps,
// 						givenValidCommunityName,
// 						givenValidCreatedBy,
// 						givenInvalidPassport,
// 					);
// 				};
// 				const integrationEvent = new Community(
// 					givenValidNewProps,
// 					givenInvalidPassport,
// 				)
// 					.getIntegrationEvents()
// 					.find(
// 						(e) =>
// 							e.aggregateId === givenValidNewProps.id &&
// 							e instanceof CommunityCreatedEvent,
// 					) as CommunityCreatedEvent;
// 				// Assert
// 				expect(creatingInvalidCommunity).toThrow(
// 					DomainSeedwork.PermissionError,
// 				);
// 				expect(integrationEvent).toBeUndefined();
// 			});
// 		});

// 		describe('Renaming a Community', () => {
// 			const givenValidCommunityName = 'a'.repeat(200);
// 			let givenValidProps: CommunityProps;
// 			beforeEach(() => {
// 				const givenValidCreatedBy = vi.mocked({
// 					displayName: 'Test User',
// 				} as EndUserEntityReference);
// 				givenValidProps = vi.mocked({
// 					name: 'valid-community-name',
// 					createdBy: givenValidCreatedBy,
// 				} as CommunityProps);
// 			});

// 			it('Given a user with permission and a valid new name at max length, when they attempt to rename the community, then it should update the name', () => {
// 				const givenValidPassport = getMockedPassport({
// 					canManageCommunitySettings: true,
// 				});
// 				const community = new Community(givenValidProps, givenValidPassport);
// 				const renaming = () => {
// 					community.name = givenValidCommunityName;
// 				};
// 				expect(renaming).not.toThrow();
// 				expect(community.name).toBe(givenValidCommunityName);
// 			});
// 			it('Given a user with permission and a valid new name at min length, when they attempt to rename the community, then it should update the name', () => {
// 				const givenValidName = 'x';
// 				const givenValidPassport = getMockedPassport({
// 					canManageCommunitySettings: true,
// 				});
// 				const community = new Community(givenValidProps, givenValidPassport);
// 				const renaming = () => {
// 					community.name = givenValidName;
// 				};
// 				expect(renaming).not.toThrow();
// 				expect(community.name).toBe(givenValidName);
// 			});
// 			it('Given a user with permission and the same name, when they attempt to rename the community, then it should not throw and name remains unchanged', () => {
// 				const givenValidPassport = getMockedPassport({
// 					canManageCommunitySettings: true,
// 				});
// 				const community = new Community(givenValidProps, givenValidPassport);
// 				const renaming = () => {
// 					community.name = 'valid-community-name';
// 				};
// 				expect(renaming).not.toThrow();
// 				expect(community.name).toBe('valid-community-name');
// 			});
// 			it('Given a user with permission and an empty name, when they attempt to rename the community, then it should throw an error', () => {
// 				const givenValidPassport = getMockedPassport({
// 					canManageCommunitySettings: true,
// 				});
// 				const community = new Community(givenValidProps, givenValidPassport);
// 				const renaming = () => {
// 					community.name = '';
// 				};
// 				expect(renaming).toThrow('Too short');
// 				expect(community.name).toBe('valid-community-name');
// 			});
// 			it('Given a user with permission and a null name, when they attempt to rename the community, then it should throw an error', () => {
// 				const givenValidPassport = getMockedPassport({
// 					canManageCommunitySettings: true,
// 				});
// 				const community = new Community(givenValidProps, givenValidPassport);
// 				const renaming = () => {
// 					/* @ts-expect-error */ 
//                     community.name = null;
// 				};
// 				expect(renaming).toThrow('Wrong raw value type');
// 				expect(community.name).toBe('valid-community-name');
// 			});
// 			it('Given a user with permission and an undefined name, when they attempt to rename the community, then it should throw an error', () => {
// 				const givenValidPassport = getMockedPassport({
// 					canManageCommunitySettings: true,
// 				});
// 				const community = new Community(givenValidProps, givenValidPassport);
// 				const renaming = () => {
// 					/* @ts-expect-error */ 
//                     community.name = undefined;
// 				};
// 				expect(renaming).toThrow('Wrong raw value type');
// 				expect(community.name).toBe('valid-community-name');
// 			});
// 			it('Given a user with permission and a name with whitespace, when they attempt to rename the community, then it should trim the whitespace', () => {
// 				const givenValidNameWithWhitespace = '   valid-community-name   ';
// 				const givenValidPassport = getMockedPassport({
// 					canManageCommunitySettings: true,
// 				});
// 				const community = new Community(givenValidProps, givenValidPassport);
// 				community.name = givenValidNameWithWhitespace;
// 				expect(community.name).toBe(givenValidNameWithWhitespace.trim());
// 			});
// 			it('Given a user without permission, when they attempt to rename the community, then it should throw PermissionError', () => {
// 				const givenValidPassport = getMockedPassport({
// 					canManageCommunitySettings: false,
// 				});
// 				const community = new Community(givenValidProps, givenValidPassport);
// 				const renaming = () => {
// 					community.name = givenValidCommunityName;
// 				};
// 				expect(renaming).toThrow(DomainSeedwork.PermissionError);
// 				expect(renaming).toThrow(
// 					'You do not have permission to change the name of this community',
// 				);
// 				expect(community.name).toBe('valid-community-name');
// 			});
// 		});

// 		describe('Changing the Community Domain', () => {
// 			let givenValidProps: CommunityProps;
// 			beforeEach(() => {
// 				const givenValidCreatedBy = vi.mocked({
// 					displayName: 'Test User',
// 				} as EndUserEntityReference);
// 				givenValidProps = vi.mocked({
// 					name: 'valid-community-name',
// 					createdBy: givenValidCreatedBy,
// 					domain: 'old-domain.com',
// 					id: '123',
// 				} as CommunityProps);
// 			});

// 			it('Given a user with permission and a valid new domain at max length, when they attempt to change the domain, then it should update the domain', () => {
// 				const givenValidDomainName = 'x'.repeat(500);
// 				const givenValidPassport = getMockedPassport({
// 					canManageCommunitySettings: true,
// 				});
// 				const community = new Community(givenValidProps, givenValidPassport);
// 				const changingDomain = () => {
// 					community.domain = givenValidDomainName;
// 				};
// 				expect(changingDomain).not.toThrow();
// 				expect(community.domain).toBe(givenValidDomainName);
// 			});
// 			it('Given a user with permission and a valid new domain at min length, when they attempt to change the domain, then it should update the domain', () => {
// 				const givenValidDomainName = 'x';
// 				const givenValidPassport = getMockedPassport({
// 					canManageCommunitySettings: true,
// 				});
// 				const community = new Community(givenValidProps, givenValidPassport);
// 				const changingDomain = () => {
// 					community.domain = givenValidDomainName;
// 				};
// 				expect(changingDomain).not.toThrow();
// 				expect(community.domain).toBe(givenValidDomainName);
// 			});
// 			it('Given a user with permission and a changed domain, when they change the domain, then it should emit CommunityDomainUpdatedEvent', () => {
// 				const props = {
// 					id: '123',
// 					name: 'valid-community-name',
// 					createdBy: { displayName: 'Test User' } as EndUserEntityReference,
// 					domain: 'old-domain.com',
// 					whiteLabelDomain: null,
// 					handle: null,
// 				} as CommunityProps;
// 				const givenValidPassport = getMockedPassport({
// 					canManageCommunitySettings: true,
// 				});
// 				const community = new Community(props, givenValidPassport);
// 				community.domain = 'new-domain.com';
// 				const integrationEvent = community
// 					.getIntegrationEvents()
// 					.find(
// 						(e) =>
// 							e.aggregateId === props.id &&
// 							e instanceof CommunityDomainUpdatedEvent,
// 					) as CommunityDomainUpdatedEvent;
// 				expect(integrationEvent).toBeDefined();
// 				expect(integrationEvent.payload).toBeDefined();
// 				expect(integrationEvent.payload.communityId).toBe(props.id);
// 				expect(integrationEvent.payload.domain).toBe('new-domain.com');
// 				expect(integrationEvent.payload.oldDomain).toBe('old-domain.com');
// 			});
// 			it('Given a user with permission and a too long domain, when they attempt to change the domain, then it should throw an error', () => {
// 				const givenValidPassport = getMockedPassport({
// 					canManageCommunitySettings: true,
// 				});
// 				const community = new Community(givenValidProps, givenValidPassport);
// 				const changingDomain = () => {
// 					community.domain = 'x'.repeat(501);
// 				};
// 				expect(changingDomain).toThrow('Too long');
// 				expect(community.domain).toBe('old-domain.com');
// 			});
// 			it('Given a user with permission and an empty domain, when they attempt to change the domain, then it should throw an error', () => {
// 				const givenValidPassport = getMockedPassport({
// 					canManageCommunitySettings: true,
// 				});
// 				const community = new Community(givenValidProps, givenValidPassport);
// 				const changingDomain = () => {
// 					community.domain = '';
// 				};
// 				expect(changingDomain).toThrow('Too short');
// 				expect(community.domain).toBe('old-domain.com');
// 			});
// 			it('Given a user with permission and a null domain, when they attempt to change the domain, then it should throw an error', () => {
// 				const givenValidPassport = getMockedPassport({
// 					canManageCommunitySettings: true,
// 				});
// 				const community = new Community(givenValidProps, givenValidPassport);
// 				const changingDomain = () => {
// 					/* @ts-expect-error */ 
//                     community.domain = null;
// 				};
// 				expect(changingDomain).toThrow('Wrong raw value type');
// 				expect(community.domain).toBe('old-domain.com');
// 			});
// 			it('Given a user with permission and an undefined domain, when they attempt to change the domain, then it should throw an error', () => {
// 				const givenValidPassport = getMockedPassport({
// 					canManageCommunitySettings: true,
// 				});
// 				const community = new Community(givenValidProps, givenValidPassport);
// 				const changingDomain = () => {
// 					/* @ts-expect-error */ 
//                     community.domain = undefined;
// 				};
// 				expect(changingDomain).toThrow('Wrong raw value type');
// 				expect(community.domain).toBe('old-domain.com');
// 			});
// 			it('Given a user with permission and a domain with whitespace, when they attempt to change the domain, then it should trim the whitespace', () => {
// 				const givenValidDomainWithWhitespace = '   new-domain.com   ';
// 				const givenValidPassport = getMockedPassport({
// 					canManageCommunitySettings: true,
// 				});
// 				const community = new Community(givenValidProps, givenValidPassport);
// 				community.domain = givenValidDomainWithWhitespace;
// 				expect(community.domain).toBe(givenValidDomainWithWhitespace.trim());
// 			});
// 			it('Given a user with permission and the same domain, when they attempt to change the domain, then it should not emit CommunityDomainUpdatedEvent', () => {
// 				const givenValidPassport = getMockedPassport({
// 					canManageCommunitySettings: true,
// 				});
// 				const community = new Community(givenValidProps, givenValidPassport);
// 				community.domain = 'old-domain.com';
// 				expect(community.domain).toBe('old-domain.com');
// 				const events = community
// 					.getIntegrationEvents()
// 					.filter((e) => e instanceof CommunityDomainUpdatedEvent);
// 				expect(events.length).toBe(0);
// 			});
// 			it('Given a user without permission, when they attempt to change the domain, then it should throw PermissionError', () => {
// 				const givenValidPassport = getMockedPassport({
// 					canManageCommunitySettings: false,
// 				});
// 				const community = new Community(givenValidProps, givenValidPassport);
// 				const changingDomain = () => {
// 					community.domain = 'new-domain.com';
// 				};
// 				expect(changingDomain).toThrow(DomainSeedwork.PermissionError);
// 				expect(changingDomain).toThrow(
// 					'You do not have permission to change the domain of this community',
// 				);
// 				expect(community.domain).toBe('old-domain.com');
// 			});
// 			it('Given a user without permission, when they attempt to change the domain, then it should not emit CommunityDomainUpdatedEvent', () => {
// 				const givenValidPassport = getMockedPassport({
// 					canManageCommunitySettings: false,
// 				});
// 				const community = new Community(givenValidProps, givenValidPassport);
// 				const changingDomain = () => {
// 					community.domain = 'new-domain.com';
// 				};
// 				expect(changingDomain).toThrow(DomainSeedwork.PermissionError);
// 				const integrationEvent = community
// 					.getIntegrationEvents()
// 					.find(
// 						(e) =>
// 							e.aggregateId === givenValidProps.id &&
// 							e instanceof CommunityDomainUpdatedEvent,
// 					) as CommunityDomainUpdatedEvent;
// 				expect(integrationEvent).toBeUndefined();
// 				expect(community.domain).toBe('old-domain.com');
// 			});
// 		});

// 		describe('Managing the Community Handle', () => {
// 			let givenValidProps: CommunityProps;
// 			beforeEach(() => {
// 				const givenValidCreatedBy = vi.mocked({
// 					displayName: 'Test User',
// 				} as EndUserEntityReference);
// 				givenValidProps = vi.mocked({
// 					name: 'valid-community-name',
// 					createdBy: givenValidCreatedBy,
// 					handle: 'old-handle',
// 				} as CommunityProps);
// 			});

// 			it('Given a user with permission and a valid new handle at min length, when they attempt to change the handle, then it should update the handle', () => {
// 				const givenValidHandle = 'x';
// 				const givenValidPassport = getMockedPassport({
// 					canManageCommunitySettings: true,
// 				});
// 				const community = new Community(givenValidProps, givenValidPassport);
// 				const changingHandle = () => {
// 					community.handle = givenValidHandle;
// 				};
// 				expect(changingHandle).not.toThrow();
// 				expect(community.handle).toBe(givenValidHandle);
// 			});
// 			it('Given a user with permission and a valid new handle at max length, when they attempt to change the handle, then it should update the handle', () => {
// 				const givenValidHandle = 'x'.repeat(50);
// 				const givenValidPassport = getMockedPassport({
// 					canManageCommunitySettings: true,
// 				});
// 				const community = new Community(givenValidProps, givenValidPassport);
// 				const changingHandle = () => {
// 					community.handle = givenValidHandle;
// 				};
// 				expect(changingHandle).not.toThrow();
// 				expect(community.handle).toBe(givenValidHandle);
// 			});
// 			it('Given a user with permission and a null handle, when they attempt to change the handle, then it should set handle to null', () => {
// 				const givenValidPassport = getMockedPassport({
// 					canManageCommunitySettings: true,
// 				});
// 				const community = new Community(givenValidProps, givenValidPassport);
// 				const changingHandle = () => {
// 					community.handle = null;
// 				};
// 				expect(changingHandle).not.toThrow();
// 				expect(community.handle).toBeNull();
// 			});
// 			it('Given a user with permission and the same handle, when they attempt to change the handle, then it should not throw and handle remains unchanged', () => {
// 				const givenValidPassport = getMockedPassport({
// 					canManageCommunitySettings: true,
// 				});
// 				const community = new Community(givenValidProps, givenValidPassport);
// 				const changingHandle = () => {
// 					community.handle = 'old-handle';
// 				};
// 				expect(changingHandle).not.toThrow();
// 				expect(community.handle).toBe('old-handle');
// 			});
// 			it('Given a user with permission and a too long handle, when they attempt to change the handle, then it should throw an error', () => {
// 				const givenInvalidHandle = 'x'.repeat(51);
// 				const givenValidPassport = getMockedPassport({
// 					canManageCommunitySettings: true,
// 				});
// 				const community = new Community(givenValidProps, givenValidPassport);
// 				const changingHandle = () => {
// 					community.handle = givenInvalidHandle;
// 				};
// 				expect(changingHandle).toThrow('Too long');
// 				expect(community.handle).toBe('old-handle');
// 			});
// 			it('Given a user with permission and an empty handle, when they attempt to change the handle, then it should throw an error', () => {
// 				const givenValidPassport = getMockedPassport({
// 					canManageCommunitySettings: true,
// 				});
// 				const community = new Community(givenValidProps, givenValidPassport);
// 				const changingHandle = () => {
// 					community.handle = '';
// 				};
// 				expect(changingHandle).toThrow('Too short');
// 				expect(community.handle).toBe('old-handle');
// 			});
// 			it('Given a user with permission and an undefined handle, when they attempt to change the handle, then it should throw an error', () => {
// 				const givenValidPassport = getMockedPassport({
// 					canManageCommunitySettings: true,
// 				});
// 				const community = new Community(givenValidProps, givenValidPassport);
// 				const changingHandle = () => {
// 					/* @ts-expect-error */ 
//                     community.handle = undefined;
// 				};
// 				expect(changingHandle).toThrow('Wrong raw value type');
// 				expect(community.handle).toBe('old-handle');
// 			});
// 			it('Given a user with permission and a handle with whitespace, when they attempt to change the handle, then it should trim the whitespace', () => {
// 				const givenValidHandleWithWhitespace = '   new-handle   ';
// 				const givenValidPassport = getMockedPassport({
// 					canManageCommunitySettings: true,
// 				});
// 				const community = new Community(givenValidProps, givenValidPassport);
// 				community.handle = givenValidHandleWithWhitespace;
// 				expect(community.handle).toBe(givenValidHandleWithWhitespace.trim());
// 			});
// 			it('Given a user without permission, when they attempt to change the handle, then it should throw PermissionError', () => {
// 				const givenValidPassport = getMockedPassport({
// 					canManageCommunitySettings: false,
// 				});
// 				const community = new Community(givenValidProps, givenValidPassport);
// 				const changingHandle = () => {
// 					community.handle = 'new-handle';
// 				};
// 				expect(changingHandle).toThrow(DomainSeedwork.PermissionError);
// 				expect(changingHandle).toThrow(
// 					'You do not have permission to change the handle of this community',
// 				);
// 				expect(community.handle).toBe('old-handle');
// 			});
// 		});

// 		describe('Managing the Community White Label Domain', () => {
// 			let givenValidProps: CommunityProps;
// 			beforeEach(() => {
// 				const givenValidCreatedBy = vi.mocked({
// 					displayName: 'Test User',
// 				} as EndUserEntityReference);
// 				givenValidProps = vi.mocked({
// 					id: '123',
// 					name: 'valid-community-name',
// 					createdBy: givenValidCreatedBy,
// 					whiteLabelDomain: 'old-white-label.com',
// 				} as CommunityProps);
// 			});

// 			it('Given a user with permission and a valid new whiteLabelDomain at max length, when they attempt to change the whiteLabelDomain, then it should update the whiteLabelDomain', () => {
// 				const givenValidWhiteLabelDomain = 'x'.repeat(500);
// 				const givenValidPassport = getMockedPassport({
// 					canManageCommunitySettings: true,
// 				});
// 				const community = new Community(givenValidProps, givenValidPassport);
// 				const changingWhiteLabelDomain = () => {
// 					community.whiteLabelDomain = givenValidWhiteLabelDomain;
// 				};
// 				expect(changingWhiteLabelDomain).not.toThrow();
// 				expect(community.whiteLabelDomain).toBe(givenValidWhiteLabelDomain);
// 			});
// 			it('Given a user with permission and a valid new whiteLabelDomain at min length, when they attempt to change the whiteLabelDomain, then it should update the whiteLabelDomain', () => {
// 				const givenValidWhiteLabelDomain = 'x';
// 				const givenValidPassport = getMockedPassport({
// 					canManageCommunitySettings: true,
// 				});
// 				const community = new Community(givenValidProps, givenValidPassport);
// 				const changingWhiteLabelDomain = () => {
// 					community.whiteLabelDomain = givenValidWhiteLabelDomain;
// 				};
// 				expect(changingWhiteLabelDomain).not.toThrow();
// 				expect(community.whiteLabelDomain).toBe(givenValidWhiteLabelDomain);
// 			});
// 			it('Given a user with permission and a null whiteLabelDomain, when they attempt to change the whiteLabelDomain, then it should set whiteLabelDomain to null', () => {
// 				const givenValidPassport = getMockedPassport({
// 					canManageCommunitySettings: true,
// 				});
// 				const community = new Community(givenValidProps, givenValidPassport);
// 				const changingWhiteLabelDomain = () => {
// 					community.whiteLabelDomain = null;
// 				};
// 				expect(changingWhiteLabelDomain).not.toThrow();
// 				expect(community.whiteLabelDomain).toBe(null);
// 			});
// 			it('Given a user with permission and a too long whiteLabelDomain, when they attempt to change the whiteLabelDomain, then it should throw an error', () => {
// 				const givenInvalidWhiteLabelDomain = 'x'.repeat(501);
// 				const givenValidPassport = getMockedPassport({
// 					canManageCommunitySettings: true,
// 				});
// 				const community = new Community(givenValidProps, givenValidPassport);
// 				const changingWhiteLabelDomain = () => {
// 					community.whiteLabelDomain = givenInvalidWhiteLabelDomain;
// 				};
// 				expect(changingWhiteLabelDomain).toThrow('Too long');
// 				expect(community.whiteLabelDomain).toBe('old-white-label.com');
// 			});
// 			it('Given a user with permission and an empty whiteLabelDomain, when they attempt to change the whiteLabelDomain, then it should throw an error', () => {
// 				const givenValidPassport = getMockedPassport({
// 					canManageCommunitySettings: true,
// 				});
// 				const community = new Community(givenValidProps, givenValidPassport);
// 				const changingWhiteLabelDomain = () => {
// 					community.whiteLabelDomain = '';
// 				};
// 				expect(changingWhiteLabelDomain).toThrow('Too short');
// 				expect(community.whiteLabelDomain).toBe('old-white-label.com');
// 			});
// 			it('Given a user with permission and an undefined whiteLabelDomain, when they attempt to change the whiteLabelDomain, then it should throw an error', () => {
// 				const givenValidPassport = getMockedPassport({
// 					canManageCommunitySettings: true,
// 				});
// 				const community = new Community(givenValidProps, givenValidPassport);
// 				const changingWhiteLabelDomain = () => {
// 					/* @ts-expect-error */ 
//                     community.whiteLabelDomain = undefined;
// 				};
// 				expect(changingWhiteLabelDomain).toThrow('Wrong raw value type');
// 				expect(community.whiteLabelDomain).toBe('old-white-label.com');
// 			});
// 			it('Given a user with permission and a changed whiteLabelDomain, when they change the whiteLabelDomain, then it should emit CommunityWhiteLabelDomainUpdatedEvent', () => {
// 				const givenValidPassport = getMockedPassport({
// 					canManageCommunitySettings: true,
// 				});
// 				const community = new Community(givenValidProps, givenValidPassport);
// 				community.whiteLabelDomain = 'new-white-label.com';
// 				const integrationEvent = community
// 					.getIntegrationEvents()
// 					.find(
// 						(e) =>
// 							e instanceof CommunityWhiteLabelDomainUpdatedEvent &&
// 							e.aggregateId === givenValidProps.id,
// 					);
// 				expect(integrationEvent).toBeDefined();
// 				expect(integrationEvent?.payload).toEqual({
// 					communityId: givenValidProps.id,
// 					oldWhiteLabelDomain: 'old-white-label.com',
// 					whiteLabelDomain: 'new-white-label.com',
// 				});
// 			});
// 			it('Given a user with permission and the same whiteLabelDomain, when they attempt to change the whiteLabelDomain, then it should not emit CommunityWhiteLabelDomainUpdatedEvent', () => {
// 				const givenValidPassport = getMockedPassport({
// 					canManageCommunitySettings: true,
// 				});
// 				const community = new Community(givenValidProps, givenValidPassport);
// 				community.whiteLabelDomain = 'old-white-label.com';
// 				expect(community.whiteLabelDomain).toBe('old-white-label.com');
// 				const events = community
// 					.getIntegrationEvents()
// 					.filter((e) => e instanceof CommunityWhiteLabelDomainUpdatedEvent);
// 				expect(events.length).toBe(0);
// 			});
// 			it('Given a user with permission and a whiteLabelDomain with whitespace, when they attempt to change the whiteLabelDomain, then it should trim the whitespace', () => {
// 				const givenValidWhiteLabelDomainWithWhitespace =
// 					'   new-white-label.com   ';
// 				const givenValidPassport = getMockedPassport({
// 					canManageCommunitySettings: true,
// 				});
// 				const community = new Community(givenValidProps, givenValidPassport);
// 				community.whiteLabelDomain = givenValidWhiteLabelDomainWithWhitespace;
// 				expect(community.whiteLabelDomain).toBe(
// 					givenValidWhiteLabelDomainWithWhitespace.trim(),
// 				);
// 			});
// 			it('Given a user without permission, when they attempt to change the whiteLabelDomain, then it should throw PermissionError', () => {
// 				const givenValidPassport = getMockedPassport({
// 					canManageCommunitySettings: false,
// 				});
// 				const community = new Community(givenValidProps, givenValidPassport);
// 				const changingWhiteLabelDomain = () => {
// 					community.whiteLabelDomain = 'new-white-label.com';
// 				};
// 				expect(changingWhiteLabelDomain).toThrow(
// 					DomainSeedwork.PermissionError,
// 				);
// 				expect(changingWhiteLabelDomain).toThrow(
// 					'You do not have permission to change the white label domain of this community',
// 				);
// 				expect(community.whiteLabelDomain).toBe('old-white-label.com');
// 			});
// 			it('Given a user without permission, when they attempt to change the whiteLabelDomain, then it should not emit CommunityWhiteLabelDomainUpdatedEvent', () => {
// 				const givenValidPassport = getMockedPassport({
// 					canManageCommunitySettings: false,
// 				});
// 				const community = new Community(givenValidProps, givenValidPassport);
// 				const changingWhiteLabelDomain = () => {
// 					community.whiteLabelDomain = 'new-white-label.com';
// 				};
// 				expect(changingWhiteLabelDomain).toThrow();
// 				expect(community.whiteLabelDomain).toBe('old-white-label.com');
// 				const integrationEvent = community
// 					.getIntegrationEvents()
// 					.find(
// 						(e) =>
// 							e instanceof CommunityWhiteLabelDomainUpdatedEvent &&
// 							e.aggregateId === givenValidProps.id,
// 					);
// 				expect(integrationEvent).toBeUndefined();
// 			});
// 		});
// 	});
// });
