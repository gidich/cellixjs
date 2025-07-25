Feature: <Entity> EndUserPersonalInformation

  Background:
    Given valid EndUserIdentityDetailsProps and EndUserContactInformationProps
    And a valid UserVisa

  Scenario: Creating a new EndUserPersonalInformation instance
    When I create a new EndUserPersonalInformation using getNewInstance with the identity details and contact information
    Then the entity's identity details should be set to the provided identity details
    And the entity's contact information should be set to the provided contact information

  Scenario: Setting identity details after creation
    Given an existing EndUserPersonalInformation instance
    When I try to set the identity details
    Then an error should be thrown indicating identity details cannot be set

  Scenario: Setting contact information after creation
    Given an existing EndUserPersonalInformation instance
    When I try to set the contact information
    Then an error should be thrown indicating contact information cannot be set

  Scenario: Getting identity details and contact information
    Given an EndUserPersonalInformation instance
    When I access identity details and contact information
    Then I should receive EndUserIdentityDetails and EndUserContactInformation entity instances