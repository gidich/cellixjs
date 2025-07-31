```instructions
---
applyTo: "./packages/api-event-handler/**/*.ts"
---
# Copilot Instructions: @ocom/api-event-handler

## Purpose
- This package provides event handlers for domain events and integration events in the CellixJS DDD architecture.
- Implements Azure Functions-based event handlers that respond to domain events from aggregate roots.
- Orchestrates cross-boundary communications and side effects triggered by domain events.
- Handles asynchronous processing of integration events that don't affect transaction boundaries.

## Architecture & Patterns
- **Azure Functions Integration**: Event handlers are Azure Functions that respond to events from the event bus.
- **Domain-Driven Design**: Follows DDD patterns with clear separation between domain events and integration events.
- **Event-Driven Architecture**: Implements the Observer pattern for decoupled event handling.
- **CQRS Support**: Event handlers often update read models or trigger command processing.
- **Transactional Boundaries**: Integration events are processed outside main transaction scope.

## Event Types
- **Domain Events**: In-process events within transactional scope (handled synchronously).
- **Integration Events**: Cross-boundary events processed asynchronously outside transactions.
- **Event Sources**: Events originate from aggregate roots in `@ocom/api-domain`.

## Coding Conventions
- All event handlers must be exported through `index.ts`.
- Event handler functions should follow Azure Functions v4 patterns.
- Use dependency injection through the Cellix service registry.
- Event handlers should be idempotent and handle retries gracefully.
- Follow error handling patterns that don't break event processing chains.
- Use OpenTelemetry for distributed tracing across event handlers.

## File/Folder Structure
```
src/
├── index.ts                     # Package exports
├── handlers/                    # Event handler implementations
│   ├── domain/                  # Domain event handlers (sync)
│   └── integration/             # Integration event handlers (async)
├── azure-functions/             # Azure Functions adapters
└── infrastructure/              # Event bus configuration and utilities
```

## Integration with CellixJS
- Register event handlers with the Cellix service container.
- Use `@ocom/api-domain` event types and aggregate references.
- Access domain data sources through the service registry.
- Follow the established Azure Functions registration pattern.

## Testing
- Unit tests are required for all event handlers.
- Use dependency injection for testability.
- Mock external dependencies and event bus interactions.
- Test both success and failure scenarios.
- Ensure handlers are idempotent through testing.

## Error Handling
- Event handlers must not throw unhandled exceptions that break event chains.
- Log errors comprehensively for debugging and monitoring.
- Implement circuit breaker patterns for external service calls.
- Use dead letter queues for failed event processing.

## Performance Considerations
- Event handlers should be lightweight and fast.
- Avoid long-running operations that block event processing.
- Use async/await patterns appropriately.
- Consider batching for high-volume events.

## Examples
- To add a domain event handler: Create handler in `src/handlers/domain/` and register with event bus.
- To add integration event handler: Create handler in `src/handlers/integration/` for async processing.
- To register with Azure Functions: Use Cellix registration pattern in main application.
```