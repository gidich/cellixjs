Feature: Community Management
  As a community administrator
  I want to create and manage communities
  So that users can organize themselves into groups

  Background:
    Given a community administrator with valid permissions
    And the required community creation context is set up

  Scenario: Creating a community with valid data
    Given a valid community name "valid-community-name"
    When I create a new community
    Then the community should be created successfully
    And a CommunityCreatedEvent should be raised

  Scenario: Rejecting a community with invalid name that is too long
    Given an invalid community name that is too long
    When I attempt to create a community with the invalid name
    Then the community creation should fail
    And the error should indicate the name is too long
