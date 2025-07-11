Feature: Vendor User Management
  As a vendor administrator
  I want to create and manage vendor users
  So that vendor representatives can access the system with appropriate permissions

  Background:
    Given a vendor user administrator with valid permissions
    And the required vendor user creation context is set up

  Scenario: Creating a vendor user with valid data
    Given a valid vendor user external ID "9b5b121b-7726-460c-8ead-58378c9ab29e"
    And a valid vendor user last name "Doe"
    And a valid vendor user rest of name "John"
    When I create a new vendor user
    Then the vendor user should be created successfully
    And a VendorUserCreatedEvent should be raised

  Scenario: Setting legal name flag when rest of name is provided
    Given a valid vendor user external ID "9b5b121b-7726-460c-8ead-58378c9ab29e"
    And a valid vendor user last name "Doe"
    And a valid vendor user rest of name "John"
    When I create a new vendor user
    Then the vendor user should be created successfully
    And the vendor user legal name should consist of multiple names

  Scenario: Setting legal name flag when rest of name is not provided
    Given a valid vendor user external ID "9b5b121b-7726-460c-8ead-58378c9ab29e"
    And a valid vendor user last name "Doe"
    And an empty vendor user rest of name
    When I create a new vendor user
    Then the vendor user should be created successfully
    And the vendor user legal name should consist of one name

  Scenario: Rejecting invalid external ID - too short
    Given an invalid vendor user external ID "this-is-an-invalid-external-id"
    And a valid vendor user last name "Doe"
    And a valid vendor user rest of name "John"
    When I attempt to create a new vendor user
    Then a vendor user validation error should be thrown
    And the vendor user error message should contain "Too short"

  Scenario: Rejecting invalid rest of name - too long
    Given a valid vendor user external ID "9b5b121b-7726-460c-8ead-58378c9ab29e"
    And a vendor user rest of name that is too long
    And a valid vendor user last name "Doe"
    When I attempt to create a new vendor user
    Then a vendor user validation error should be thrown
    And the vendor user error message should contain "Too long"

  Scenario: Rejecting invalid last name - too long
    Given a valid vendor user external ID "9b5b121b-7726-460c-8ead-58378c9ab29e"
    And a valid vendor user rest of name "John"
    And a vendor user last name that is too long
    When I attempt to create a new vendor user
    Then a vendor user validation error should be thrown
    And the vendor user error message should contain "Too long"

  Scenario: Updating vendor user email with invalid format
    Given a valid vendor user external ID "9b5b121b-7726-460c-8ead-58378c9ab29e"
    And a valid vendor user last name "Doe"
    And a valid vendor user rest of name "John"
    And a created vendor user
    When I update the vendor user email to "bad-email"
    Then the vendor user update should fail
    And the vendor user error message should contain "Value doesn't match pattern"

  Scenario: Updating vendor user email with valid format
    Given a valid vendor user external ID "9b5b121b-7726-460c-8ead-58378c9ab29e"
    And a valid vendor user last name "Doe"
    And a valid vendor user rest of name "John"
    And a created vendor user
    When I update the vendor user email to "new.email@example.com"
    Then the vendor user update should be successful

  Scenario: Updating vendor user without proper permissions
    Given a valid vendor user external ID "9b5b121b-7726-460c-8ead-58378c9ab29e"
    And a valid vendor user last name "Doe"
    And a valid vendor user rest of name "John"
    And a created vendor user
    And a user without vendor user management permissions
    When I attempt to update the vendor user display name to "Jane Doe"
    Then a vendor user permission error should be thrown
    And the vendor user error message should contain "Unauthorized"

  Scenario: Updating vendor user with proper permissions
    Given a valid vendor user external ID "9b5b121b-7726-460c-8ead-58378c9ab29e"
    And a valid vendor user last name "Doe"
    And a valid vendor user rest of name "John"
    And a created vendor user
    And a user with vendor user management permissions
    When I update the vendor user display name to "Jane Doe"
    Then the vendor user update should be successful
    And the vendor user display name should be "Jane Doe"
