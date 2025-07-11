Feature: Aggregate Root
  As a domain developer
  I want to use aggregate roots to manage domain and integration events
  So that I can build robust domain models with event sourcing capabilities

  Background:
    Given I have test aggregate properties with id "test-aggregate-id", name "Test Aggregate", and version 1
    And I have test passport with userId "test-user-id" and permissions ["read", "write"]

  Scenario: Creating an aggregate root
    When I create a test aggregate with the properties and passport
    Then the aggregate should have id "test-aggregate-id"
    And the aggregate should have name "Test Aggregate"
    And the aggregate passport should match the provided passport
    And the aggregate should not be deleted initially
    And the aggregate should have no domain events initially
    And the aggregate should have no integration events initially

  Scenario: Managing deletion status
    Given I have created a test aggregate
    When I mark the aggregate as deleted
    Then the aggregate should be marked as deleted

  Scenario: Adding domain events
    Given I have created a test aggregate
    When I add a domain event with message "test message"
    Then the aggregate should have 1 domain event
    And the domain event should have aggregateId "test-aggregate-id"
    And the domain event should have the correct payload

  Scenario: Adding multiple domain events
    Given I have created a test aggregate
    When I add a domain event with message "first"
    And I add a domain event with message "second"
    Then the aggregate should have 2 domain events
    And the first domain event should have message "first"
    And the second domain event should have message "second"

  Scenario: Clearing domain events
    Given I have created a test aggregate
    And I have added a domain event with message "test message"
    When I clear the domain events
    Then the aggregate should have no domain events

  Scenario: Domain events are readonly
    Given I have created a test aggregate
    When I add a domain event with message "test message"
    Then the domain events array should be readonly

  Scenario: Adding integration events
    Given I have created a test aggregate
    When I add an integration event with message "integration test message"
    Then the aggregate should have 1 integration event
    And the integration event should have aggregateId "test-aggregate-id"
    And the integration event should have the correct payload

  Scenario: Adding multiple integration events
    Given I have created a test aggregate
    When I add an integration event with message "first integration"
    And I add an integration event with message "second integration"
    Then the aggregate should have 2 integration events
    And the first integration event should have message "first integration"
    And the second integration event should have message "second integration"

  Scenario: Clearing integration events
    Given I have created a test aggregate
    And I have added an integration event with message "integration test message"
    When I clear the integration events
    Then the aggregate should have no integration events

  Scenario: Integration events are readonly
    Given I have created a test aggregate
    When I add an integration event with message "integration test message"
    Then the integration events array should be readonly

  Scenario: Event isolation
    Given I have created a test aggregate
    When I add a domain event with message "domain"
    And I add an integration event with message "integration"
    Then the aggregate should have 1 domain event
    And the aggregate should have 1 integration event
    And the domain event should have message "domain"
    And the integration event should have message "integration"

  Scenario: Independent domain event clearing
    Given I have created a test aggregate
    And I have added a domain event with message "domain"
    And I have added an integration event with message "integration"
    When I clear the domain events
    Then the aggregate should have no domain events
    And the aggregate should have 1 integration event

  Scenario: Independent integration event clearing
    Given I have created a test aggregate
    And I have added a domain event with message "domain"
    And I have added an integration event with message "integration"
    When I clear the integration events
    Then the aggregate should have 1 domain event
    And the aggregate should have no integration events

  Scenario: RootEventRegistry interface compliance
    Given I have created a test aggregate
    When I use the aggregate as a RootEventRegistry
    And I add a domain event via registry with message "test"
    And I add an integration event via registry with message "test"
    Then the aggregate should have 1 domain event
    And the aggregate should have 1 integration event

  Scenario: OnSave method functionality
    Given I have created a test aggregate
    When I trigger the onSave method with isModified true
    Then the onSave method should be called without throwing
    When I trigger the onSave method with isModified false
    Then the onSave method should be called without throwing

  Scenario: OnSave method can be overridden
    Given I have a custom aggregate that overrides onSave
    When I trigger the onSave method with isModified true
    And I trigger the onSave method with isModified false
    Then the custom onSave should have been called 2 times
    And the last isModified value should be false

  Scenario: Inheritance from DomainEntity
    Given I have created a test aggregate
    Then the aggregate should inherit the id property from DomainEntity
    And the aggregate should inherit the props property from DomainEntity

  Scenario: Passport protection
    Given I have created a test aggregate
    When I get the passport from the aggregate
    Then the passport should match the original passport
    And the passport should be the same reference

  Scenario: Complex payload handling
    Given I have created a test aggregate
    When I add a domain event with complex payload
    Then the aggregate should have 1 domain event
    And the complex payload should be preserved correctly

  Scenario: Rapid event operations
    Given I have created a test aggregate
    When I add 100 domain events rapidly
    And I add 100 integration events rapidly
    Then the aggregate should have 100 domain events
    And the aggregate should have 100 integration events
    When I clear all domain events
    And I clear all integration events
    Then the aggregate should have no domain events
    And the aggregate should have no integration events
