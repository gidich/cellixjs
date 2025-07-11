Feature: End User Management
  As a user administrator
  I want to create and manage end users
  So that users can register and manage their profiles

  Background:
    Given an end user administrator with valid permissions
    And the required end user creation context is set up

  Scenario: Creating an end user with valid data
    Given a valid external ID "9b5b121b-7726-460c-8ead-58378c9ab29e"
    And a valid last name "Doe"
    And a valid rest of name "John"
    And a valid email "john.doe@example.com"
    When I create a new end user
    Then the end user should be created successfully
    And an EndUserCreatedEvent should be raised

  Scenario: Setting legal name flag when rest of name is provided
    Given a valid external ID "9b5b121b-7726-460c-8ead-58378c9ab29e"
    And a valid last name "Doe"
    And a valid rest of name "John"
    And a valid email "john.doe@example.com"
    When I create a new end user
    Then the end user should be created successfully
    And the legal name should consist of multiple names

  Scenario: Setting legal name flag when rest of name is not provided
    Given a valid external ID "9b5b121b-7726-460c-8ead-58378c9ab29e"
    And a valid last name "Doe"
    And an empty rest of name
    And a valid email "john.doe@example.com"
    When I create a new end user
    Then the end user should be created successfully
    And the legal name should consist of one name

  Scenario: Rejecting an end user with invalid external ID
    Given a valid last name "Doe"
    And a valid rest of name "John"
    And a valid email "john.doe@example.com"
    And an invalid external ID "this-is-an-invalid-external-id"
    When I attempt to create an end user with the invalid external ID
    Then the end user creation should fail
    And the error should indicate the external ID is too short

  Scenario: Rejecting an end user with invalid rest of name that is too long
    Given a valid external ID "9b5b121b-7726-460c-8ead-58378c9ab29e"
    And a valid last name "Doe"
    And a valid email "john.doe@example.com"
    And an invalid rest of name that is too long
    When I attempt to create an end user with the invalid rest of name
    Then the end user creation should fail
    And the error should indicate the rest of name is too long

  Scenario: Rejecting an end user with invalid last name that is too long
    Given a valid external ID "9b5b121b-7726-460c-8ead-58378c9ab29e"
    And a valid rest of name "John"
    And a valid email "john.doe@example.com"
    And an invalid last name that is too long
    When I attempt to create an end user with the invalid last name
    Then the end user creation should fail
    And the error should indicate the last name is too long

  Scenario: Rejecting invalid email update
    Given a valid external ID "9b5b121b-7726-460c-8ead-58378c9ab29e"
    And a valid last name "Doe"
    And a valid rest of name "John"
    And a valid email "john.doe@example.com"
    And a created end user
    When I update the end user email to "bad-email"
    Then the end user update should fail
    And the error should indicate the end user email format is invalid

  Scenario: Updating end user with valid email
    Given a valid external ID "9b5b121b-7726-460c-8ead-58378c9ab29e"
    And a valid last name "Doe"
    And a valid rest of name "John"
    And a valid email "john.doe@example.com"
    And a created end user
    When I update the end user email to "test@email.com"
    Then the end user update should be successful
