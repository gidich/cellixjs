Feature: Community Management
  As an administrator of a community
  I want to manage community settings
  So that I can ensure the community operates smoothly and meets the needs of its members

  Background:
    Given a user with the permission to manage community settings
    And an existing community
   # Name management

  Scenario: Renaming the community with a valid new name
    When the user renames the community to a valid new name
    Then the community name is updated

  Scenario: Renaming the community to a name that is too long
    When the user renames the community to a name longer than 200 characters
    Then the system rejects the update with a "Too long" error

  Scenario: Renaming the community to an empty name
    When the user renames the community to an empty name
    Then the system rejects the update with a "Too short" error

  Scenario: Renaming the community without permission
    Given a user without permission to manage community settings
    When the user renames the community to a valid new name
    Then the system rejects the update with a permission error
  # Domain management

  Scenario: Changing the community domain to a valid new domain
    When the user changes the community domain to a valid new domain
    Then the community domain is updated
    And a CommunityDomainUpdated event is emitted

  Scenario: Changing the community domain to the same value
    When the user changes the community domain to the current domain
    Then no CommunityDomainUpdated event is emitted

  Scenario: Changing the community domain to a domain that is too long
    When the user changes the community domain to a domain longer than 500 characters
    Then the system rejects the update with a "Too long" error

  Scenario: Changing the community domain without permission
    Given a user without permission to manage community settings
    When the user changes the community domain to a valid new domain
    Then the system rejects the update with a permission error
  # White label domain management

  Scenario: Changing the white label domain to a valid new value
    When the user changes the white label domain to a valid new value
    Then the white label domain is updated
    And a CommunityWhiteLabelDomainUpdated event is emitted

  Scenario: Clearing the white label domain
    When the user clears the white label domain
    Then the white label domain is set to null
    And a CommunityWhiteLabelDomainUpdated event is emitted

  Scenario: Changing the white label domain to the same value
    When the user changes the white label domain to the current value
    Then no CommunityWhiteLabelDomainUpdated event is emitted
    And the white label domain remains unchanged

  Scenario: Changing the white label domain without permission
    Given a user without permission to manage community settings
    When the user changes the white label domain to a valid new value
    Then the system rejects the update with a permission error
    And no CommunityWhiteLabelDomainUpdated event is emitted
  # Handle management

  Scenario: Changing the community handle to a valid new handle
    When the user changes the community handle to a valid new handle
    Then the community handle is updated

  Scenario: Clearing the community handle
    When the user clears the community handle
    Then the community handle is set to null

  Scenario: Changing the community handle to a handle that is too long
    When the user changes the community handle to a handle longer than 50 characters
    Then the system rejects the update with a "Too long" error

  Scenario: Changing the community handle to an empty handle
    When the user changes the community handle to an empty handle
    Then the system rejects the update with a "Too short" error

  Scenario: Changing the community handle without providing a handle
    When the user changes the community handle without providing a handle
    Then the system rejects the update with a "Wrong raw value type" error

  Scenario: Changing the community handle without permission
    Given a user without permission to manage community settings
    When the user changes the community handle to a valid new handle
    Then the system rejects the update with a permission error
