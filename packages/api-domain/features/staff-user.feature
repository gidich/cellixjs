Feature: Staff User Management
  As a staff administrator
  I want to create and manage staff users
  So that staff members can access the system with appropriate roles

  Background:
    Given a staff user administrator with valid permissions
    And the required staff user creation context is set up

  Scenario: Creating a staff user with valid data
    Given a valid staff user external ID "9b5b121b-7726-460c-8ead-58378c9ab29e"
    And a valid staff user first name "John"
    And a valid staff user last name "Doe"
    And a valid staff user email "john.doe@example.com"
    When I create a new staff user
    Then the staff user should be created successfully
    And a StaffUserCreatedEvent should be raised

  Scenario: Rejecting invalid external ID - too short
    Given an invalid staff user external ID "this-is-an-invalid-external-id"
    And a valid staff user first name "John"
    And a valid staff user last name "Doe"
    And a valid staff user email "john.doe@example.com"
    When I attempt to create a new staff user
    Then a staff user validation error should be thrown
    And the staff user error message should contain "Too short"

  Scenario: Rejecting invalid first name - too long
    Given a valid staff user external ID "9b5b121b-7726-460c-8ead-58378c9ab29e"
    And a first name that is too long
    And a valid staff user last name "Doe"
    And a valid staff user email "john.doe@example.com"
    When I attempt to create a new staff user
    Then a staff user validation error should be thrown
    And the staff user error message should contain "Too long"

  Scenario: Rejecting invalid last name - too long
    Given a valid staff user external ID "9b5b121b-7726-460c-8ead-58378c9ab29e"
    And a valid staff user first name "John"
    And a last name that is too long
    And a valid staff user email "john.doe@example.com"
    When I attempt to create a new staff user
    Then a staff user validation error should be thrown
    And the staff user error message should contain "Too long"

  Scenario: Updating staff user email with invalid format
    Given a valid staff user external ID "9b5b121b-7726-460c-8ead-58378c9ab29e"
    And a valid staff user first name "John"
    And a valid staff user last name "Doe"
    And a valid staff user email "john.doe@example.com"
    And a created staff user
    When I update the staff user email to "bad-email"
    Then the staff user update should fail
    And the staff user error message should contain "Value doesn't match pattern"

  Scenario: Updating staff user email with valid format
    Given a valid staff user external ID "9b5b121b-7726-460c-8ead-58378c9ab29e"
    And a valid staff user first name "John"
    And a valid staff user last name "Doe"
    And a valid staff user email "john.doe@example.com"
    And a created staff user
    When I update the staff user email to "new.email@example.com"
    Then the staff user update should be successful

  Scenario: Updating staff user without proper permissions
    Given a valid staff user external ID "9b5b121b-7726-460c-8ead-58378c9ab29e"
    And a valid staff user first name "John"
    And a valid staff user last name "Doe"
    And a valid staff user email "john.doe@example.com"
    And a created staff user
    And a user without staff user management permissions
    When I attempt to update the staff user first name to "Jane"
    Then a staff user permission error should be thrown
    And the staff user error message should contain "Unauthorized"

  Scenario: Updating staff user with proper permissions
    Given a valid staff user external ID "9b5b121b-7726-460c-8ead-58378c9ab29e"
    And a valid staff user first name "John"
    And a valid staff user last name "Doe"
    And a valid staff user email "john.doe@example.com"
    And a created staff user
    And a user with staff user management permissions
    When I update the staff user first name to "Jane"
    Then the staff user update should be successful
    And the staff user first name should be "Jane"
