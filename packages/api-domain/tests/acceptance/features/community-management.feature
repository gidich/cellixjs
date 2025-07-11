Feature: Community Management
  As a system administrator
  I want to manage communities
  So that I can control community settings and permissions

  Background:
    Given I am an authorized user with community management permissions

  Scenario: Rejecting community creation with invalid name - too long
    Given I have valid community data
    When I try to create a community with a name longer than 200 characters
    Then the community creation should fail
    And I should receive an error message containing "Too long"

  Scenario: Allowing community creation with valid name
    Given I have valid community data
    When I attempt to create a community named "Valid Community Name"
    Then the community "Valid Community Name" should be created successfully