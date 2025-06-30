import { Community, type CommunityProps } from './community.ts';
import type { EndUserEntityReference } from '../../user/end-user/end-user.ts';
import type { CommunityVisa } from '../community.visa.ts';
import type { Passport } from '../../passport.ts';
import { CommunityCreatedEvent } from '../../../events/types/community-created.ts';
import type { CommunityPassport } from '../community.passport.ts';
import type { CommunityDomainPermissions } from '../community.domain-permissions.ts';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { UserPassport } from '../../user/user.passport.ts';
import { EndUser } from '../../user/end-user/end-user.ts';
import { DomainSeedwork } from '@cellix/domain-seedwork';
import { CommunityDomainUpdatedEvent } from '../../../events/types/community-domain-updated.ts';
import { CommunityWhiteLabelDomainUpdatedEvent } from '../../../events/types/community-white-label-domain-updated.ts';

describe('domain.contexts.community::community', () => {
	const givenValidCommunityName = 'valid-community-name';
	const givenValidCreatedBy = vi.mocked({
		displayName: 'Test User',
	} as EndUserEntityReference);

	/**
	 * @param {Partial<CommunityDomainPermissions>} partialPermissions - Only need to define permissions that you want to be true, others will be false
	 * @returns {Passport}
	 */
	const getMockedPassport: (
		partialPermissions: Partial<CommunityDomainPermissions>,
	) => Passport = (partialPermissions) => {
		const mockCommunityVisa = vi.mocked({
			determineIf: (
				fn: (permissions: Readonly<CommunityDomainPermissions>) => boolean,
			) => {
				return fn(partialPermissions as CommunityDomainPermissions);
			},
		} as CommunityVisa);

		const givenValidPassport = vi.mocked({} as Passport);
		givenValidPassport.community = vi.mocked({
			forCommunity: vi.fn(() => mockCommunityVisa),
		} as CommunityPassport);

		// Add a minimal user mock to avoid errors in EndUser
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

	describe('[Aggregate] Community', () => {
		describe('Creating a Community', () => {
			let givenValidNewProps: CommunityProps;
			const now = new Date();
			beforeEach(() => {
				givenValidNewProps = vi.mocked({
					id: '123',
					createdAt: now,
					updatedAt: now,
					schemaVersion: '1.0',
				} as CommunityProps);
				givenValidNewProps.createdBy = vi.mocked({} as EndUserEntityReference);
			});

			describe('when user has permission to create communities', () => {
				it('should succeed with valid name and createdBy', () => {
					// Arrange
					const givenValidPassport = getMockedPassport({
						canCreateCommunities: true,
					});
					// Act
					const community = Community.getNewInstance(
						givenValidNewProps,
						givenValidCommunityName,
						givenValidCreatedBy,
						givenValidPassport,
					);
					// Assert
					expect(community).toBeInstanceOf(Community);
					expect(community.props).toEqual(givenValidNewProps);
					expect(community.name).toBe(givenValidCommunityName);
					expect(community.createdBy).toBeInstanceOf(EndUser);
					expect(community.createdBy.displayName).toBe(
						givenValidCreatedBy.displayName,
					);
					expect(community.createdAt).toBe(now);
					expect(community.updatedAt).toBe(now);
					expect(community.schemaVersion).toBe('1.0');
				});

				it('should reject a name that is too long', () => {
					// Arrange
					const givenValidPassport = getMockedPassport({
						canCreateCommunities: true,
					});
					const givenInvalidCommunityName = 'a'.repeat(201);
					// Act
					const creatingInvalidCommunity = () => {
						Community.getNewInstance(
							givenValidNewProps,
							givenInvalidCommunityName,
							givenValidCreatedBy,
							givenValidPassport,
						);
					};
					// Assert
					expect(creatingInvalidCommunity).toThrow('Too long');
				});

				it('should reject a name that is too short', () => {
					// Arrange
					const givenValidPassport = getMockedPassport({
						canCreateCommunities: true,
					});
					const givenInvalidCommunityName = '';
					// Act
					const creatingInvalidCommunity = () => {
						Community.getNewInstance(
							givenValidNewProps,
							givenInvalidCommunityName,
							givenValidCreatedBy,
							givenValidPassport,
						);
					};
					// Assert
					expect(creatingInvalidCommunity).toThrow('Too short');
				});

				it('should reject a null createdBy', () => {
					// Arrange
					const givenValidPassport = getMockedPassport({
						canCreateCommunities: true,
					});
					const givenInvalidCreatedBy = null;
					// Act
					const creatingInvalidCommunity = () => {
						Community.getNewInstance(
							givenValidNewProps,
							givenValidCommunityName,
							// @ts-expect-error: testing null assignment not allowed
							givenInvalidCreatedBy,
							givenValidPassport,
						);
					};
					// Assert
					expect(creatingInvalidCommunity).toThrow(
						'createdBy cannot be null or undefined',
					);
				});

				it('should reject an undefined createdBy', () => {
					// Arrange
					const givenValidPassport = getMockedPassport({
						canCreateCommunities: true,
					});
					// Act
					const creatingInvalidCommunity = () => {
						Community.getNewInstance(
							givenValidNewProps,
							givenValidCommunityName,
							// @ts-expect-error: testing undefined assignment not allowed
							undefined,
							givenValidPassport,
						);
					};
					// Assert
					expect(creatingInvalidCommunity).toThrow(
						'createdBy cannot be null or undefined',
					);
				});

				it('should emit CommunityCreatedEvent on creation', () => {
					// Arrange
					const expectedNewId = '12345';
					const givenValidNewProps = vi.mocked({
						id: expectedNewId,
					} as CommunityProps);
					givenValidNewProps.createdBy = vi.mocked(
						{} as EndUserEntityReference,
					);
					const givenValidPassport = getMockedPassport({
						canCreateCommunities: true,
					});
					// Act
					const community = Community.getNewInstance(
						givenValidNewProps,
						givenValidCommunityName,
						givenValidCreatedBy,
						givenValidPassport,
					);
					const integrationEvent = community
						.getIntegrationEvents()
						.find(
							(e) =>
								e.aggregateId === expectedNewId &&
								e instanceof CommunityCreatedEvent,
						) as CommunityCreatedEvent;
					// Assert
					expect(integrationEvent.payload.communityId).toBe(expectedNewId);
				});
			});

			describe('when user lacks permission to create communities', () => {
				it('should throw PermissionError', () => {
					// Arrange
					const givenInvalidPassport = getMockedPassport({
						canCreateCommunities: false,
					});
					// Act
					const creatingInvalidCommunity = () => {
						Community.getNewInstance(
							givenValidNewProps,
							givenValidCommunityName,
							givenValidCreatedBy,
							givenInvalidPassport,
						);
					};
					// Assert
					expect(creatingInvalidCommunity).toThrow(
						DomainSeedwork.PermissionError,
					);
					expect(creatingInvalidCommunity).toThrow(
						'You do not have permission to create communities',
					);
				});
				it('should not emit CommunityCreatedEvent', () => {
					// Arrange
					const givenInvalidPassport = getMockedPassport({
						canCreateCommunities: false,
					});
					// Act
					const creatingInvalidCommunity = () => {
						Community.getNewInstance(
							givenValidNewProps,
							givenValidCommunityName,
							givenValidCreatedBy,
							givenInvalidPassport,
						);
					};
					// Assert
					expect(creatingInvalidCommunity).toThrow(
						DomainSeedwork.PermissionError,
					);
					const integrationEvent = new Community(
						givenValidNewProps,
						givenInvalidPassport,
					)
						.getIntegrationEvents()
						.find(
							(e) =>
								e.aggregateId === '123' && e instanceof CommunityCreatedEvent,
						) as CommunityCreatedEvent;

					expect(integrationEvent).toBeUndefined();
				});
			});
		});

		describe('Renaming a Community', () => {
			const givenValidCommunityName = 'a'.repeat(200);
			let givenValidProps: CommunityProps;
			beforeEach(() => {
				const givenValidCreatedBy = vi.mocked({
					displayName: 'Test User',
				} as EndUserEntityReference);
				givenValidProps = vi.mocked({
					name: 'valid-community-name',
					createdBy: givenValidCreatedBy,
				} as CommunityProps);
			});

			describe('when user has permission to manage community settings', () => {
				it('should allow renaming if name meets maximum length', () => {
					// Arrange
					const givenValidPassport = getMockedPassport({
						canManageCommunitySettings: true,
					});
					const community = new Community(givenValidProps, givenValidPassport);
					// Act
					const updatingCommunityName = () => {
						community.name = givenValidCommunityName;
					};
					// Assert
					expect(updatingCommunityName).not.toThrow();
					expect(community.name).not.toBe('valid-community-name');
					expect(community.name).toBe(givenValidCommunityName);
				});
                it('should allow renaming if name meets minimum length', () => {
                    // Arrange
                    const givenValidName = 'x';
                    const givenValidPassport = getMockedPassport({
						canManageCommunitySettings: true,
					});
                    const community = new Community(givenValidProps, givenValidPassport);
                    // Act
                    const updatingCommunityName = () => {
                        community.name = givenValidName;
                    };
                    // Assert
                    expect(updatingCommunityName).not.toThrow();
                    expect(community.name).toBe(givenValidName);
                });
				it('should allow renaming if name is unchanged', () => {
					const givenValidPassport = getMockedPassport({
						canManageCommunitySettings: true,
					});
					const community = new Community(givenValidProps, givenValidPassport);
					const updatingCommunityName = () => {
						community.name = 'valid-community-name';
					};
					expect(updatingCommunityName).not.toThrow();
					expect(community.name).toBe('valid-community-name');
				});
				it('should reject renaming if name is empty', () => {
					// Arrange
					const givenValidPassport = getMockedPassport({
						canManageCommunitySettings: true,
					});
					const community = new Community(givenValidProps, givenValidPassport);
					// Act
					const updatingCommunityNameToEmptyString = () => {
						community.name = '';
					};
					// Assert
					expect(updatingCommunityNameToEmptyString).toThrow('Too short');
					expect(community.name).toBe('valid-community-name');
				});

				it('should reject renaming if name is null', () => {
					// Arrange
					const givenValidPassport = getMockedPassport({
						canManageCommunitySettings: true,
					});
					const community = new Community(givenValidProps, givenValidPassport);
					// Act
					const updatingCommunityNameToNull = () => {
						// @ts-expect-error: testing null assignment not allowed
						community.name = null;
					};
					// Assert
					expect(updatingCommunityNameToNull).toThrow('Wrong raw value type');
					expect(community.name).toBe('valid-community-name');
				});

				it('should reject renaming if name is undefined', () => {
					// Arrange
					const givenValidPassport = getMockedPassport({
						canManageCommunitySettings: true,
					});
					const community = new Community(givenValidProps, givenValidPassport);
					// Act
					const updatingCommunityNameToUndefined = () => {
						// @ts-expect-error: testing undefined assignment not allowed
						community.name = undefined;
					};
					// Assert
					expect(updatingCommunityNameToUndefined).toThrow(
						'Wrong raw value type',
					);
					expect(community.name).toBe('valid-community-name');
				});
                it('should trim whitespace from a valid name when renaming', () => {
					// Arrange
                    const givenValidNameWithWhitespace = '   valid-community-name   ';
					const givenValidPassport = getMockedPassport({
						canManageCommunitySettings: true,
					});
					const community = new Community(givenValidProps, givenValidPassport);
					// Act
					community.name = givenValidNameWithWhitespace;
					// Assert
					expect(community.name).not.toBe(givenValidNameWithWhitespace);
					expect(community.name).toBe(givenValidNameWithWhitespace.trim());
				});
			});

			describe('when user lacks permission to manage community settings', () => {
				it('should throw PermissionError', () => {
					// Arrange
					const givenValidPassport = getMockedPassport({
						canManageCommunitySettings: false,
					});
					const community = new Community(givenValidProps, givenValidPassport);
					// Act
					const updatingCommunityName = () => {
						community.name = givenValidCommunityName;
					};
					// Assert
					expect(updatingCommunityName).toThrow(DomainSeedwork.PermissionError);
					expect(updatingCommunityName).toThrow(
						'You do not have permission to change the name of this community',
					);
					expect(community.name).toBe('valid-community-name');
				});
			});
		});

		describe('Changing the Community Domain', () => {
			let givenValidProps: CommunityProps;
			beforeEach(() => {
				const givenValidCreatedBy = vi.mocked({
					displayName: 'Test User',
				} as EndUserEntityReference);
				givenValidProps = vi.mocked({
					name: 'valid-community-name',
					createdBy: givenValidCreatedBy,
					domain: 'old-domain.com',
					id: '123',
				} as CommunityProps);
			});

			describe('when user has permission to manage community settings', () => {
				it('should allow domain change if domain meets maximum length', () => {
					const givenValidDomainName = 'x'.repeat(500);
					const givenValidPassport = getMockedPassport({
						canManageCommunitySettings: true,
					});
					const community = new Community(givenValidProps, givenValidPassport);
					const updatingCommunityDomain = () => {
						community.domain = givenValidDomainName;
					};
					expect(updatingCommunityDomain).not.toThrow();
					expect(community.domain).not.toBe('old-domain.com');
					expect(community.domain).toBe(givenValidDomainName);
				});

                it('should allow domain change if domain meets minimum length', () => {
                    const givenValidDomainName = 'x';
                    const givenValidPassport = getMockedPassport({
                        canManageCommunitySettings: true,
                    });
                    const community = new Community(givenValidProps, givenValidPassport);
                    const updatingCommunityDomain = () => {
                        community.domain = givenValidDomainName;
                    };
                    expect(updatingCommunityDomain).not.toThrow();
                    expect(community.domain).not.toBe('old-domain.com');
                    expect(community.domain).toBe(givenValidDomainName);
                });

				it('should emit CommunityDomainUpdatedEvent if domain is changed', () => {
					// Arrange
					const givenValidProps: CommunityProps = {
						id: '123',
						name: 'valid-community-name',
						createdBy: { displayName: 'Test User' } as EndUserEntityReference,
						domain: 'old-domain.com',
						whiteLabelDomain: null,
						handle: null,
						get createdAt() {
							return new Date();
						},
						get updatedAt() {
							return new Date();
						},
						get schemaVersion() {
							return '1';
						},
					};
					const givenValidPassport = getMockedPassport({
						canManageCommunitySettings: true,
					});
					const community = new Community(givenValidProps, givenValidPassport);
					// Act
					community.domain = 'new-domain.com';
					const integrationEvent = community
						.getIntegrationEvents()
						.find(
							(e) =>
								e.aggregateId === givenValidProps.id &&
								e instanceof CommunityDomainUpdatedEvent,
						) as CommunityDomainUpdatedEvent;
					// Assert
					expect(integrationEvent).toBeDefined();
					expect(integrationEvent.payload).toBeDefined();
					expect(integrationEvent.payload.communityId).toBe(givenValidProps.id);
					expect(integrationEvent.payload.domain).toBe('new-domain.com');
					expect(integrationEvent.payload.oldDomain).toBe('old-domain.com');
				});

                it('should reject domain change if domain is too long', () => {
                    // Arrange
                    const givenValidPassport = getMockedPassport({
                        canManageCommunitySettings: true,
                    });
                    const community = new Community(givenValidProps, givenValidPassport);
                    // Act
                    const updatingCommunityDomain = () => {
                        community.domain = 'x'.repeat(501);
                    };
                    // Assert
                    expect(updatingCommunityDomain).toThrow('Too long');
                    expect(community.domain).toBe('old-domain.com');
                });

				it('should reject domain change if domain is empty', () => {
					// Arrange
					const givenValidPassport = getMockedPassport({
						canManageCommunitySettings: true,
					});
					const community = new Community(givenValidProps, givenValidPassport);
					// Act
					const updatingCommunityDomain = () => {
						community.domain = '';
					};
					// Assert
					expect(updatingCommunityDomain).toThrow('Too short');
					expect(community.domain).toBe('old-domain.com');
				});

				it('should reject domain change if domain is null', () => {
					// Arrange
					const givenValidPassport = getMockedPassport({
						canManageCommunitySettings: true,
					});
					const community = new Community(givenValidProps, givenValidPassport);
					// Act
					const updatingCommunityDomainToNull = () => {
						// @ts-expect-error: testing null assignment not allowed
						community.domain = null;
					};
					// Assert
					expect(updatingCommunityDomainToNull).toThrow('Wrong raw value type');
					expect(community.domain).toBe('old-domain.com');
				});

				it('should reject domain change if domain is undefined', () => {
					// Arrange
					const givenValidPassport = getMockedPassport({
						canManageCommunitySettings: true,
					});
					const community = new Community(givenValidProps, givenValidPassport);
					// Act
					const updatingCommunityDomainToUndefined = () => {
						// @ts-expect-error: testing undefined assignment not allowed
						community.domain = undefined;
					};
					// Assert
					expect(updatingCommunityDomainToUndefined).toThrow(
						'Wrong raw value type',
					);
					expect(community.domain).toBe('old-domain.com');
				});

                it('should trim whitespace from a valid domain when changing', () => {
                    // Arrange
                    const givenValidDomainWithWhitespace = '   new-domain.com   ';
                    const givenValidPassport = getMockedPassport({
                        canManageCommunitySettings: true,
                    });
                    const community = new Community(givenValidProps, givenValidPassport);
                    // Act
                    community.domain = givenValidDomainWithWhitespace;
                    // Assert
                    expect(community.domain).not.toBe(givenValidDomainWithWhitespace);
                    expect(community.domain).toBe(givenValidDomainWithWhitespace.trim());
                });

                it('should not emit CommunityDomainUpdatedEvent if domain is unchanged', () => {
                    // Arrange
                    const givenValidPassport = getMockedPassport({
                        canManageCommunitySettings: true,
                    });
                    // Act
                    const community = new Community(
                        givenValidProps,
                        givenValidPassport,
                    );
                    community.domain = 'old-domain.com'; // same as current
                    // Assert
                    expect(community.domain).toBe('old-domain.com');
                    const events = community
                        .getIntegrationEvents()
                        .filter(
                            (e) =>
                                e instanceof
                                CommunityDomainUpdatedEvent,
                        );
                    expect(events.length).toBe(0);
                });
			});

			describe('when user lacks permission to manage community settings', () => {
				it('should throw PermissionError', () => {
					// Arrange
					const givenValidPassport = getMockedPassport({
						canManageCommunitySettings: false,
					});
					const community = new Community(givenValidProps, givenValidPassport);
					// Act
					const updatingCommunityDomain = () => {
						community.domain = 'new-domain.com';
					};
					// Assert
					expect(updatingCommunityDomain).toThrow(
						DomainSeedwork.PermissionError,
					);
					expect(updatingCommunityDomain).toThrow(
						'You do not have permission to change the domain of this community',
					);
					expect(community.domain).toBe('old-domain.com');
				});

				it('should not emit CommunityDomainUpdatedEvent', () => {
                    // Arrange
					const givenValidPassport = getMockedPassport({
						canManageCommunitySettings: false,
					});
					const community = new Community(givenValidProps, givenValidPassport);
                    // Act
					const updatingCommunityDomain = () => {
						community.domain = 'new-domain.com';
					};
                    // Assert
					expect(updatingCommunityDomain).toThrow(
						DomainSeedwork.PermissionError,
					);
					const integrationEvent = community
						.getIntegrationEvents()
						.find(
							(e) =>
								e.aggregateId === givenValidProps.id &&
								e instanceof CommunityDomainUpdatedEvent,
						) as CommunityDomainUpdatedEvent;
					expect(integrationEvent).toBeUndefined();
					expect(community.domain).toBe('old-domain.com');
				});
			});
		});

		describe('Managing the Community Handle', () => {
            let givenValidProps: CommunityProps;
            beforeEach(() => {
                const givenValidCreatedBy = vi.mocked({
                    displayName: 'Test User',
                } as EndUserEntityReference);
                givenValidProps = vi.mocked({
                    name: 'valid-community-name',
                    createdBy: givenValidCreatedBy,
                    handle: 'old-handle',
                } as CommunityProps);
            });

			describe('when user has permission to manage community settings', () => {
				it('should allow handle change if handle meets minimum length', () => {
                    // Arrange
                    const givenValidHandle = 'x';
					const givenValidPassport = getMockedPassport({
						canManageCommunitySettings: true,
					});
					const community = new Community(givenValidProps, givenValidPassport);
                    // Act
					const updatingCommunityHandle = () => {
						community.handle = givenValidHandle;
					};
                    // Assert
					expect(updatingCommunityHandle).not.toThrow();
                    expect(community.handle).not.toBe('old-handle');
					expect(community.handle).toBe(givenValidHandle);
				});

                it('should allow handle change if handle meets maximum length', () => {
                    // Arrange
                    const givenValidHandle = 'x'.repeat(50);
                    const givenValidPassport = getMockedPassport({
                        canManageCommunitySettings: true,
                    });
                    const community = new Community(givenValidProps, givenValidPassport);
                    // Act
                    const updatingCommunityHandle = () => {
                        community.handle = givenValidHandle;
                    };
                    // Assert
                    expect(updatingCommunityHandle).not.toThrow();
                    expect(community.handle).not.toBe('old-handle');
                    expect(community.handle).toBe(givenValidHandle);
                });

				it('should allow handle change if handle is null', () => {
                    // Arrange
					const givenValidPassport = getMockedPassport({
						canManageCommunitySettings: true,
					});
					const community = new Community(givenValidProps, givenValidPassport);
                    // Act
					const updatingCommunityHandleToNull = () => {
						community.handle = null;
					};
                    // Assert
					expect(updatingCommunityHandleToNull).not.toThrow();
					expect(community.handle).toBeNull();
				});

                it('should allow handle change if handle is unchanged', () => {
                    // Arrange
                    const givenValidPassport = getMockedPassport({
                        canManageCommunitySettings: true,
                    });
                    const community = new Community(givenValidProps, givenValidPassport);
                    // Act
                    const updatingCommunityHandle = () => {
                        community.handle = 'old-handle';
                    };
                    // Assert
                    expect(updatingCommunityHandle).not.toThrow();
                    expect(community.handle).toBe('old-handle');
                });

                it('should reject handle change if handle is too long', () => {
                    // Arrange
                    const givenInvalidHandle = 'x'.repeat(51);
                    const givenValidPassport = getMockedPassport({
                        canManageCommunitySettings: true,
                    });
                    const community = new Community(givenValidProps, givenValidPassport);
                    // Act
                    const updatingCommunityHandle = () => {
                        community.handle = givenInvalidHandle;
                    };
                    // Assert
                    expect(updatingCommunityHandle).toThrow('Too long');
                    expect(community.handle).not.toBe(givenInvalidHandle);
                    expect(community.handle).toBe('old-handle');
                });

                it('should reject handle change if handle is empty', () => {
                    // Arrange
                    const givenValidPassport = getMockedPassport({
                        canManageCommunitySettings: true,
                    });
                    const community = new Community(givenValidProps, givenValidPassport);
                    // Act
                    const updatingCommunityHandle = () => {
                        community.handle = '';
                    };
                    // Assert
                    expect(updatingCommunityHandle).toThrow('Too short');
                    expect(community.handle).not.toBe('');
                    expect(community.handle).toBe('old-handle');
                });

				it('should reject handle change if handle is undefined', () => {
                    // Arrange
					const givenValidPassport = getMockedPassport({
						canManageCommunitySettings: true,
					});
					const community = new Community(givenValidProps, givenValidPassport);
                    // Act
					const updatingCommunityHandleToUndefined = () => {
						// @ts-expect-error: testing undefined assignment not allowed
						community.handle = undefined;
					};
                    // Assert
					expect(updatingCommunityHandleToUndefined).toThrow(
						'Wrong raw value type',
					);
                    expect(community.handle).toBeDefined();
                    expect(community.handle).toBe('old-handle');
				});

                it('should trim whitespace from a valid handle when changing', () => {
                    // Arrange
                    const givenValidHandleWithWhitespace = '   new-handle   ';
                    const givenValidPassport = getMockedPassport({
                        canManageCommunitySettings: true,
                    });
                    const community = new Community(givenValidProps, givenValidPassport);
                    // Act
                    community.handle = givenValidHandleWithWhitespace;
                    // Assert
                    expect(community.handle).not.toBe(givenValidHandleWithWhitespace);
                    expect(community.handle).toBe(givenValidHandleWithWhitespace.trim());
                });
			});

			describe('when user lacks permission to manage community settings', () => {
				it('should throw PermissionError', () => {
                    // Arrange
					const givenValidPassport = getMockedPassport({
						canManageCommunitySettings: false,
					});
					const community = new Community(givenValidProps, givenValidPassport);
                    // Act
					const updatingCommunityHandle = () => {
						community.handle = 'new-handle';
					};
                    // Assert
					expect(updatingCommunityHandle).toThrow(
						DomainSeedwork.PermissionError,
					);
					expect(updatingCommunityHandle).toThrow(
						'You do not have permission to change the handle of this community',
					);
                    expect(community.handle).toBe('old-handle');
				});
			});
		});

		describe('Managing the Community White Label Domain', () => {
			const givenValidCreatedBy = vi.mocked({
				displayName: 'Test User',
			} as EndUserEntityReference);
			const givenValidProps = vi.mocked({
				name: 'valid-community-name',
				createdBy: givenValidCreatedBy,
				whiteLabelDomain: 'old-white-label.com',
			} as CommunityProps);

			describe('when user has permission to manage community settings', () => {
				it('should allow whiteLabelDomain change if whiteLabelDomain meets maximum length', () => {
                    // Arrange
                    const givenValidWhiteLabelDomain = 'x'.repeat(500);
					const givenValidPassport = getMockedPassport({
						canManageCommunitySettings: true,
					});
					const community = new Community(givenValidProps, givenValidPassport);
                    // Act
					const updatingCommunityWhiteLabelDomain = () => {
						community.whiteLabelDomain = givenValidWhiteLabelDomain;
					};
                    // Assert
					expect(updatingCommunityWhiteLabelDomain).not.toThrow();
					expect(community.whiteLabelDomain).toBe(givenValidWhiteLabelDomain);
				});

                it('should allow whiteLabelDomain change if whiteLabelDomain meets minimum length', () => {
                    // Arrange
                    const givenValidWhiteLabelDomain = 'x';
                    const givenValidPassport = getMockedPassport({
                        canManageCommunitySettings: true,
                    });
                    const community = new Community(givenValidProps, givenValidPassport);
                    // Act
                    const updatingCommunityWhiteLabelDomain = () => {
                        community.whiteLabelDomain = givenValidWhiteLabelDomain;
                    };
                    // Assert
                    expect(updatingCommunityWhiteLabelDomain).not.toThrow();
                    expect(community.whiteLabelDomain).toBe(givenValidWhiteLabelDomain);
                });

                it('should allow whiteLabelDomain change if whiteLabelDomain is null', () => {
                    // Arrange
                    const givenValidPassport = getMockedPassport({
                        canManageCommunitySettings: true,
                    });
                    const community = new Community(givenValidProps, givenValidPassport);
                    // Act
                    const updatingCommunityWhiteLabelDomain = () => {
                        community.whiteLabelDomain = null;
                    };
                    // Assert
                    expect(updatingCommunityWhiteLabelDomain).not.toThrow();
                    expect(community.whiteLabelDomain).toBe(null);
                });

                it('should reject whiteLabelDomain change if whiteLabelDomain is too long', () => {
                    // Arrange
                    const givenInvalidWhiteLabelDomain = 'x'.repeat(501);
                    const givenValidPassport = getMockedPassport({
                        canManageCommunitySettings: true,
                    });
                    const community = new Community(givenValidProps, givenValidPassport);
                    // Act
                    const updatingCommunityWhiteLabelDomain = () => {
                        community.whiteLabelDomain = givenInvalidWhiteLabelDomain;
                    };
                    // Assert
                    expect(updatingCommunityWhiteLabelDomain).toThrow('Too long');
                    expect(community.whiteLabelDomain).not.toBe(givenInvalidWhiteLabelDomain);
                    expect(community.whiteLabelDomain).toBe('old-white-label.com');
                });

                it('should reject whiteLabelDomain change if whiteLabelDomain is empty', () => {
                    // Arrange
                    const givenValidPassport = getMockedPassport({
                        canManageCommunitySettings: true,
                    });
                    const community = new Community(givenValidProps, givenValidPassport);
                    // Act
                    const updatingCommunityWhiteLabelDomain = () => {
                        community.whiteLabelDomain = '';
                    };
                    // Assert
                    expect(updatingCommunityWhiteLabelDomain).toThrow('Too short');
                    expect(community.whiteLabelDomain).not.toBe('');
                    expect(community.whiteLabelDomain).toBe('old-white-label.com');
                });

                it('should reject whiteLabelDomain change if whiteLabelDomain is undefined', () => {
                    // Arrange
                    const givenValidPassport = getMockedPassport({
                        canManageCommunitySettings: true,
                    });
                    const community = new Community(givenValidProps, givenValidPassport);
                    // Act
                    const updatingCommunityWhiteLabelDomainToUndefined = () => {
                        // @ts-expect-error: testing undefined assignment not allowed
                        community.whiteLabelDomain = undefined;
                    };
                    // Assert
                    expect(updatingCommunityWhiteLabelDomainToUndefined).toThrow('Wrong raw value type');
                    expect(community.whiteLabelDomain).not.toBeUndefined();
                    expect(community.whiteLabelDomain).toBe('old-white-label.com');
                });

                it('should emit CommunityWhiteLabelDomainUpdatedEvent if whiteLabelDomain is changed', () => {
                    // Arrange
                    const givenValidPassport = getMockedPassport({
                        canManageCommunitySettings: true,
                    });
                    const community = new Community(givenValidProps, givenValidPassport);
                    // Act
                    community.whiteLabelDomain = 'new-white-label.com';
                    const integrationEvent = community.getIntegrationEvents().find(
                        (e) => e instanceof CommunityWhiteLabelDomainUpdatedEvent && e.aggregateId === givenValidProps.id
                    );
                    // Assert
                    expect(integrationEvent).toBeDefined();
                    expect(integrationEvent?.payload).toEqual({
                        communityId: givenValidProps.id,
                        oldWhiteLabelDomain: 'old-white-label.com',
                        whiteLabelDomain: 'new-white-label.com',
                    });
                });

                it('should not emit CommunityWhiteLabelDomainUpdatedEvent if whiteLabelDomain is unchanged', () => {
                    // Arrange
                    const givenValidPassport = getMockedPassport({
                        canManageCommunitySettings: true,
                    });
                    const community = new Community(givenValidProps, givenValidPassport);
                    // Act
                    community.whiteLabelDomain = 'old-white-label.com'; // same as current
                    // Assert
                    expect(community.whiteLabelDomain).toBe('old-white-label.com');
                    const events = community.getIntegrationEvents().filter(
                        (e) => e instanceof CommunityWhiteLabelDomainUpdatedEvent
                    );
                    expect(events.length).toBe(0);
                });

                it('should trim whitespace from a valid whiteLabelDomain when changing', () => {
                    // Arrange
                    const givenValidWhiteLabelDomainWithWhitespace = '   new-white-label.com   ';
                    const givenValidPassport = getMockedPassport({
                        canManageCommunitySettings: true,
                    });
                    const community = new Community(givenValidProps, givenValidPassport);
                    // Act
                    community.whiteLabelDomain = givenValidWhiteLabelDomainWithWhitespace;
                    // Assert
                    expect(community.whiteLabelDomain).not.toBe(givenValidWhiteLabelDomainWithWhitespace);
                    expect(community.whiteLabelDomain).toBe(givenValidWhiteLabelDomainWithWhitespace.trim());
                });
            });

			describe('when user lacks permission to manage community settings', () => {
				it('should throw PermissionError', () => {
                    // Arrange
					const givenValidPassport = getMockedPassport({
						canManageCommunitySettings: false,
					});
					const community = new Community(givenValidProps, givenValidPassport);
                    // Act
					const updatingCommunityWhiteLabelDomain = () => {
						community.whiteLabelDomain = 'new-white-label.com';
					};
                    // Assert
					expect(updatingCommunityWhiteLabelDomain).toThrow(
						DomainSeedwork.PermissionError,
					);
					expect(updatingCommunityWhiteLabelDomain).toThrow(
						'You do not have permission to change the white label domain of this community',
					);
                    expect(community.whiteLabelDomain).toBe('old-white-label.com');
				});
                it('should not emit CommunityWhiteLabelDomainUpdatedEvent', () => {
                    // Arrange
					const givenValidPassport = getMockedPassport({
						canManageCommunitySettings: false,
					});
					const community = new Community(givenValidProps, givenValidPassport);
                    // Act
					const updatingCommunityWhiteLabelDomain = () => {
						community.whiteLabelDomain = 'new-white-label.com';
					};
                    // Assert
					expect(updatingCommunityWhiteLabelDomain).toThrow();
					expect(community.whiteLabelDomain).toBe('old-white-label.com');
	                const integrationEvent = community.getIntegrationEvents().find(
                        (e) => e instanceof CommunityWhiteLabelDomainUpdatedEvent && e.aggregateId === givenValidProps.id
					);
					expect(integrationEvent).toBeUndefined();
				});
            });
		});
	});
});
