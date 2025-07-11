Feature: Staff Role Management
  As a staff administrator
  I want to create and manage staff roles
  So that staff members can be assigned appropriate permissions

  Background:
    Given a staff administrator with valid permissions
    And the required staff role creation context is set up

  Scenario: Creating a staff role with valid data
    Given a valid role name "admin"
    And the role is not a default role
    When I create a new staff role
    Then the staff role should be created successfully

  Scenario: Creating a staff role with valid data as default role
    Given a valid role name "default-staff"
    And the role is a default role
    When I create a new staff role
    Then the staff role should be created successfully

  Scenario: Rejecting invalid role name - too long
    Given a role name that is too long
    When I attempt to create a new staff role
    Then a validation error should be thrown
    And the error message should contain "Too long"

  Scenario: Rejecting invalid role name - too short
    Given a role name that is too short
    When I attempt to create a new staff role
    Then a validation error should be thrown
    And the error message should contain "Too short"

  Scenario: Updating staff role without proper permissions
    Given an existing staff role
    And a user without staff role management permissions
    When I attempt to update the staff role permissions
    Then a permission error should be thrown
    And the error message should contain "Cannot set permission"

  Scenario: Updating staff role name without proper permissions
    Given an existing staff role
    And a user without staff role management permissions
    When I attempt to update the staff role name
    Then a permission error should be thrown
    And the error message should contain "Cannot set role name"

  Scenario: Updating staff role name with proper permissions
    Given an existing staff role
    And a user with staff role management permissions
    And a valid updated role name "updated-admin"
    When I update the staff role name
    Then the staff role name should be updated successfully

  Scenario: Deleting a staff role with reassignment
    Given an existing non-default staff role
    And a target staff role for reassignment
    And a user with staff role management permissions
    When I delete the staff role and reassign to the target role
    Then the staff role should be marked as deleted
    And a RoleDeletedReassignEvent should be raised
