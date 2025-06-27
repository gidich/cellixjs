---
sidebar_position: 12
sidebar_label: 0012 Linter: Oxlint vs Biome
description: "Decision record for selecting a linter: Oxlint vs Biome."
status: proposed
contact: nnoce14
date: 2025-06-27
deciders: gidich, etang93, mgupta83, nnoce14
consulted: <list-of-consulted>
informed: <list-of-informed>
---

# Select a Linter: Oxlint vs Biome

## Context and Problem Statement

The project requires a fast, reliable, and modern linter for TypeScript and JavaScript codebases. We are evaluating two options—Oxlint and Biome—to determine which best fits our needs for code quality, performance, ecosystem compatibility, and maintainability. The decision should be documented in a standardized and thorough way to ensure transparency and future reference.

## Decision Drivers

- Performance and speed of linting large codebases
- Quality and accuracy of linting rules
- Ecosystem compatibility (TypeScript, JavaScript, formatting, etc.)
- Integration with existing tools and CI/CD pipelines
- Community support and long-term maintenance
- Customizability and extensibility

## Considered Options

- Oxlint
- Biome

## Decision Outcome

Chosen option: _TBD_

The decision is still under evaluation. We will compare both options using the drivers above and update this record once a decision is made.

### Consequences

- Good: The selected linter will improve code quality, consistency, and developer experience.
- Bad: Switching linters later may require migration effort and retraining.

## Validation

The implementation and compliance with the selected linter will be validated by integrating it into the CI pipeline and running it across all packages. Feedback from the team and code review results will be used to assess effectiveness.

## Pros and Cons of the Options

### Oxlint

- Good, because it is written in Rust and offers high performance.
- Good, because it provides modern linting rules and supports TypeScript and JavaScript.
- Good, because it is designed for speed and can handle large codebases efficiently.
- Neutral, because its ecosystem and plugin support are still growing.
- Bad, because it may lack some advanced features or integrations compared to more mature tools.

### Biome

- Good, because it is a successor to Rome and aims to be an all-in-one tool (linting, formatting, etc.).
- Good, because it has a growing community and aims for high performance.
- Good, because it supports both linting and formatting out of the box.
- Neutral, because it is still evolving and some features may be experimental.
- Bad, because migration from existing tools may require additional configuration or adaptation.

## More Information

Further evaluation will include benchmarking both tools on our codebase, reviewing rule coverage, and assessing integration with our workflows. Team feedback and community activity will also be considered. This decision record will be updated once a final choice is made.
