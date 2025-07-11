Feature: Vendor User Role Management
  As a community administrator
  I want to create and manage vendor user roles within communities
  So that vendor users can access the system with appropriate permissions

  Background:
    Given a vendor user role administrator with valid permissions
    And the required vendor user role creation context is set up

  Scenario: Creating a vendor user role with valid data
    Given a valid vendor role name "admin"
    And the vendor role is not a default role
    And a valid community reference
    When I create a new vendor user role
    Then the vendor user role should be created successfully

  Scenario: Creating a vendor user role with valid data as default role
    Given a valid vendor role name "default-vendor"
    And the vendor role is a default role
    And a valid community reference
    When I create a new vendor user role
    Then the vendor user role should be created successfully

  Scenario: Rejecting invalid vendor role name - too long
    Given a vendor role name that is too long
    And a valid community reference
    When I attempt to create a new vendor user role
    Then a vendor user role validation error should be thrown
    And the vendor user role error message should contain "Too long"

  Scenario: Rejecting invalid vendor role name - too short
    Given a vendor role name that is too short
    And a valid community reference
    When I attempt to create a new vendor user role
    Then a vendor user role validation error should be thrown
    And the vendor user role error message should contain "Too short"

  Scenario: Updating vendor user role without proper permissions
    Given an existing vendor user role
    And a user without vendor user role management permissions
    When I attempt to update the vendor user role permissions
    Then a vendor user role permission error should be thrown
    And the vendor user role error message should contain "Cannot set permission"

  Scenario: Updating vendor user role name without proper permissions
    Given an existing vendor user role
    And a user without vendor user role management permissions
    When I attempt to update the vendor user role name
    Then a vendor user role permission error should be thrown
    And the vendor user role error message should contain "Cannot set role name"

  Scenario: Updating vendor user role name with proper permissions
    Given an existing vendor user role
    And a user with vendor user role management permissions
    And a valid updated vendor role name "updated-vendor-admin"
    When I update the vendor user role name
    Then the vendor user role name should be updated successfully

  Scenario: Deleting a vendor user role with reassignment
    Given an existing non-default vendor user role
    And a target vendor user role for reassignment
    And a user with vendor user role management permissions
    When I delete the vendor user role and reassign to the target role
    Then the vendor user role should be marked as deleted
    And a VendorUserRoleDeletedReassignEvent should be raised
