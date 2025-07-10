Feature: Member Management
  As a member administrator
  I want to create and manage members
  So that users can join communities and have profiles

  Background:
    Given a member administrator with valid permissions
    And the required member creation context is set up

  Scenario: Creating a member with valid data
    Given a valid member name "John Doe"
    When I create a new member
    Then the member should be created successfully

  Scenario: Rejecting a member with invalid name that is too long
    Given an invalid member name that is too long
    When I attempt to create a member with the invalid name
    Then the member creation should fail
    And the error should indicate the member name is too long

  Scenario: Rejecting invalid email update
    Given a valid member name "John Doe"
    And a created member
    When I update the member email to "bad-email"
    Then the member update should fail
    And the error should indicate the email format is invalid

  Scenario: Rejecting invalid cybersource ID update
    Given a valid member name "John Doe"
    And a created member
    When I update the member cybersource ID to a 51 character string
    Then the member update should fail
    And the error should indicate the field is too long

  Scenario: Rejecting invalid member name update
    Given a valid member name "John Doe"
    And a created member
    When I update the member name to a 501 character string
    Then the member update should fail
    And the error should indicate the field is too long

  Scenario: Rejecting invalid bio update
    Given a valid member name "John Doe"
    And a created member
    When I update the member bio to a 2001 character string
    Then the member update should fail
    And the error should indicate the field is too long

  Scenario: Rejecting too many interests
    Given a valid member name "John Doe"
    And a created member
    When I update the member interests to 21 items
    Then the member update should fail
    And the error should indicate the field is too long
