Feature: Community Creation
    As an Owner Community authorized user
    I want to create new communities
    So that I can organize members and properties according to my HOA needs

    Background:
        Given a user with the permission to create communities

    Scenario: Creating a new community with valid details
        When the user attempts to create a community with a valid name and creator
        Then the community is created successfully
        And a CommunityCreated event is emitted

    Scenario: Creating a community with a name at maximum length
        When the user attempts to create a community with a name of exactly 200 characters
        Then the community is created successfully
        And a CommunityCreated event is emitted

    Scenario: Creating a community with a name at minimum length
        When the user attempts to create a community with a name of exactly 1 character
        Then the community is created successfully
        And a CommunityCreated event is emitted

    Scenario: Creating a community with a name that is too long
        When the user attempts to create a community with a name longer than 200 characters
        Then the system rejects the creation with a "Too long" error
        And no CommunityCreated event is emitted

    Scenario: Creating a community with a name that is too short
        When the user attempts to create a community with a name shorter than 1 character
        Then the system rejects the creation with a "Too short" error
        And no CommunityCreated event is emitted

    Scenario: Creating a community with an empty name
        When the user attempts to create a community with an empty name
        Then the system rejects the creation with a "Wrong raw value type" error
        And no CommunityCreated event is emitted

    Scenario: Creating a community without providing a name
        When the user attempts to create a community without providing a name
        Then the system rejects the creation with a "Wrong raw value type" error
        And no CommunityCreated event is emitted

    Scenario: Creating a community with a name containing leading and trailing whitespace
        When the user attempts to create a community with a name containing leading and trailing whitespace
        Then the community is created successfully
        And the community name is trimmed of whitespace
        And a CommunityCreated event is emitted

    Scenario: Creating a community with an empty creator
        When the user attempts to create a community with an empty creator
        Then the system rejects the creation with a "createdBy cannot be null or undefined" error
        And no CommunityCreated event is emitted

    Scenario: Creating a community without providing a creator
        When the user attempts to create a community without providing a creator
        Then the system rejects the creation with a "createdBy cannot be null or undefined" error
        And no CommunityCreated event is emitted

    Scenario: Creating a community without permission
        Given a user without permission to create communities
        When the user attempts to create a community with valid details
        Then the system rejects the creation with a permission error
        And no CommunityCreated event is emitted
