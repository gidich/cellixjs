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