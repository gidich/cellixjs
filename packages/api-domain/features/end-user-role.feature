Feature: End User Role Management
  As a community administrator
  I want to create and manage end user roles within communities
  So that end users can access the system with appropriate permissions

  Background:
    Given an end user role administrator with valid permissions
    And the required end user role creation context is set up

  Scenario: Creating an end user role with valid data
    Given a valid end user role name "member"
    And the end user role is not a default role
    And a valid community reference for end user role
    When I create a new end user role
    Then the end user role should be created successfully

  Scenario: Creating an end user role with valid data as default role
    Given a valid end user role name "default-end-user"
    And the end user role is a default role
    And a valid community reference for end user role
    When I create a new end user role
    Then the end user role should be created successfully

  Scenario: Rejecting invalid end user role name - too long
    Given an end user role name that is too long
    And a valid community reference for end user role
    When I attempt to create a new end user role
    Then an end user role validation error should be thrown
    And the end user role error message should contain "Too long"

  Scenario: Rejecting invalid end user role name - too short
    Given an end user role name that is too short
    And a valid community reference for end user role
    When I attempt to create a new end user role
    Then an end user role validation error should be thrown
    And the end user role error message should contain "Too short"

  Scenario: Updating end user role without proper permissions
    Given an existing end user role
    And a user without end user role management permissions
    When I attempt to update the end user role permissions
    Then an end user role permission error should be thrown
    And the end user role error message should contain "Cannot set permission"

  Scenario: Updating end user role name without proper permissions
    Given an existing end user role
    And a user without end user role management permissions
    When I attempt to update the end user role name
    Then an end user role permission error should be thrown
    And the end user role error message should contain "Cannot set role name"

  Scenario: Updating end user role name with proper permissions
    Given an existing end user role
    And a user with end user role management permissions
    And a valid updated end user role name "updated-end-user-admin"
    When I update the end user role name
    Then the end user role name should be updated successfully

  Scenario: Deleting an end user role with reassignment
    Given an existing non-default end user role
    And a target end user role for reassignment
    And a user with end user role management permissions
    When I delete the end user role and reassign to the target role
    Then the end user role should be marked as deleted
    And an EndUserRoleDeletedReassignEvent should be raised
