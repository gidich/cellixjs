Feature: Community Management
    As an administrator of a community
    I want to manage community settings
    So that I can ensure the community operates smoothly and meets the needs of its members

    Background:
        Given a user with the permission to manage community settings
        And an existing community

    # name
    Scenario: Renaming the community with a valid new value
        When the user renames the community to a valid new name
        Then the community name is updated

    Scenario: Renaming the community to a name at maximum length
        When the user renames the community to a name of exactly 200 characters
        Then the community name is updated

    Scenario: Renaming the community to a name at minimum length
        When the user renames the community to a name of exactly 1 character
        Then the community name is updated

    Scenario: Renaming the community to a name that is too long
        When the user renames the community to a name longer than 200 characters
        Then the system rejects the name change with a "Too long" error

    Scenario: Renaming the community to a name that is too short
        When the user renames the community to a name shorter than 1 character
        Then the system rejects the name change with a "Too short" error

    Scenario: Renaming the community to clear the name
        When the user renames the community to clear the name
        Then the system rejects the name change with a "Wrong raw value type" error

    Scenario: Renaming the community without providing a name
        When the user renames the community without providing a name
        Then the system rejects the name change with a "Wrong raw value type" error

    Scenario: Renaming the community to the same name
        When the user renames the community to the current name
        Then the community name remains unchanged

    Scenario: Renaming the community to a name with leading and trailing whitespace
        When the user renames the community to a name with leading and trailing whitespace
        Then the community name is updated
        And the community name is trimmed of whitespace

    Scenario: Renaming the community without permission
        Given a user without permission to manage community settings
        When the user renames the community to a valid new name
        Then the system rejects the name change with a permission error
        And the community name remains unchanged

    # domain
    Scenario: Changing the community domain to a valid new value
        When the user changes the community domain to a valid new domain
        Then the community domain is updated
        And a CommunityDomainUpdated event is emitted

    Scenario: Changing the community domain to a value at maximum length
        When the user changes the community domain to a domain of exactly 500 characters
        Then the community domain is updated
        And a CommunityDomainUpdated event is emitted

    Scenario: Changing the community domain to a value at minimum length
        When the user changes the community domain to a domain of exactly 1 character
        Then the community domain is updated
        And a CommunityDomainUpdated event is emitted

    Scenario: Changing the community domain to a value that is too long
        When the user changes the community domain to a domain longer than 500 characters
        Then the system rejects the domain change with a "Too long" error
        And no CommunityDomainUpdated event is emitted

    Scenario: Changing the community domain to a value that is too short
        When the user changes the community domain to a domain shorter than 1 character
        Then the system rejects the domain change with a "Too short" error
        And no CommunityDomainUpdated event is emitted

    Scenario: Changing the community domain to clear the domain
        When the user changes the community domain to clear the domain
        Then the system rejects the domain change with a "Wrong raw value type" error
        And no CommunityDomainUpdated event is emitted

    Scenario: Changing the community domain without providing a domain
        When the user changes the community domain without providing a domain
        Then the system rejects the domain change with a "Wrong raw value type" error
        And no CommunityDomainUpdated event is emitted

    Scenario: Changing the community domain to the same domain
        When the user changes the community domain to the current domain
        Then the community domain remains unchanged
        And no CommunityDomainUpdated event is emitted

    Scenario: Changing the community domain to a domain with leading and trailing whitespace
        When the user changes the community domain to a domain with leading and trailing whitespace
        Then the community domain is updated
        And the community domain is trimmed of whitespace
        And a CommunityDomainUpdated event is emitted

    Scenario: Changing the community domain without permission
        Given a user without permission to manage community settings
        When the user changes the community domain to a valid new domain
        Then the system rejects the domain change with a permission error
        And no CommunityDomainUpdated event is emitted

    # white label domain
    Scenario: Changing the white label domain to a valid new value
        When the user changes the white label domain to a valid new value
        Then the white label domain is updated
        And a CommunityWhiteLabelDomainUpdated event is emitted

    Scenario: Changing the white label domain to a value at maximum length
        When the user changes the white label domain to a value of exactly 500 characters
        Then the white label domain is updated
        And a CommunityWhiteLabelDomainUpdated event is emitted

    Scenario: Changing the white label domain to a value at minimum length
        When the user changes the white label domain to a value of exactly 1 character
        Then the white label domain is updated
        And a CommunityWhiteLabelDomainUpdated event is emitted

    Scenario: Changing the white label domain to a value that is too long
        When the user changes the white label domain to a value longer than 500 characters
        Then the system rejects the white label domain change with a "Too long" error
        And no CommunityWhiteLabelDomainUpdated event is emitted

    Scenario: Changing the white label domain to a value that is too short
        When the user changes the white label domain to a value shorter than 1 character
        Then the system rejects the white label domain change with a "Too short" error
        And no CommunityWhiteLabelDomainUpdated event is emitted

    Scenario: Clearing the white label domain
        When the user clears the white label domain
        Then the white label domain is cleared
        And a CommunityWhiteLabelDomainUpdated event is emitted

    Scenario: Changing the white label domain without providing a white label domain
        When the user changes the white label domain without providing a white label domain
        Then the system rejects the white label domain change with a "Wrong raw value type" error
        And no CommunityWhiteLabelDomainUpdated event is emitted

    Scenario: Changing the white label domain to the same value
        When the user changes the white label domain to the current value
        Then the white label domain remains unchanged
        And no CommunityWhiteLabelDomainUpdated event is emitted

    Scenario: Changing the white label domain to a value with leading and trailing whitespace
        When the user changes the white label domain to a value with leading and trailing whitespace
        Then the white label domain is updated
        And the white label domain is trimmed of whitespace
        And a CommunityWhiteLabelDomainUpdated event is emitted

    Scenario: Changing the white label domain without permission
        Given a user without permission to manage community settings
        When the user changes the white label domain to a valid new value
        Then the system rejects the white label domain change with a permission error
        And no CommunityWhiteLabelDomainUpdated event is emitted

    # handle
    Scenario: Changing the community handle to a valid new handle
        When the user changes the community handle to a valid new handle
        Then the community handle is updated

    Scenario: Changing the community handle to a value at maximum length
        When the user changes the community handle to a value of exactly 50 characters
        Then the community handle is updated

    Scenario: Changing the community handle to a value at minimum length
        When the user changes the community handle to a value of exactly 1 character
        Then the community handle is updated

    Scenario: Changing the community handle to a value that is too long
        When the user changes the community handle to a value longer than 50 characters
        Then the system rejects the handle change with a "Too long" error

    Scenario: Changing the community handle to a value that is too short
        When the user changes the community handle to a value shorter than 1 character
        Then the system rejects the handle change with a "Too short" error

    Scenario: Clearing the community handle
        When the user clears the community handle
        Then the community handle is cleared

    Scenario: Changing the community handle without providing a handle
        When the user changes the community handle without providing a handle
        Then the system rejects the handle change with a "Wrong raw value type" error

    Scenario: Changing the community handle to the same handle
        When the user changes the community handle to the current handle
        Then the community handle remains unchanged

    Scenario: Changing the community handle to a handle with leading and trailing whitespace
        When the user changes the community handle to a handle with leading and trailing whitespace
        Then the community handle is updated
        And the community handle is trimmed of whitespace

    Scenario: Changing the community handle without permission
        Given a user without permission to manage community settings
        When the user changes the community handle to a valid new handle
        Then the system rejects the handle change with a permission error
        And the community handle remains unchanged
