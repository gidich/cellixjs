---
applyTo: "./packages/ui-*/src/components/**/*.graphql"
---

## Copilot Instructions: GraphQL

### Purpose

- `.graphql` files in the frontend define GraphQL queries, mutations, and fragments for use with Apollo Client and React components.
- They enable type-safe, modular, and maintainable data fetching and manipulation.

### Organization & Structure

- Place `.graphql` files next to the component or container that uses them, typically in the same feature or layout folder.
- For a given container component, there should be a corresponding `.graphql` file with the same base name. (e.g `contact-details.container.graphql`)
- All queries, mutations, and fragments used in the container component should be defined in the corresponding `.graphql` file.

### Coding Conventions

- Queries and mutations should use the following naming convention `<Layout><Container><Operation>`
    - Given a container component named `ContactDetailsContainer` in the `applicant` layout which uses the `ApplicantUser` query, the query name should be: `ApplicantContactDetailsContainerApplicantUser`
- Fragments should use the following naming convention `<Layout><Container><Type>Fields`
    - Given a container component named `ContactDetailsContainer` in the `applicant` layout, a fragment for the `ApplicantUser` type should be named: `ApplicantContactDetailsContainerUserFields`
- Always prefer reusable fragments over direct field access in queries/mutations.
- Use variables for dynamic values; avoid hardcoding IDs or parameters.
- Keep queries minimal—request only the fields needed by the component.
- Ensure queries and mutations use the same fragment definitions to ensure consistency in Apollo Cache.

### Integration

- Import `.graphql` files into TypeScript/JS files using codegen-generated types for type safety.
- Use Apollo Client hooks (`useQuery`, `useMutation`, etc.) with imported queries/mutations.
- Co-locate fragments with the components that use them for maintainability.
### Testing

- Mock queries and mutations in Storybook stories and unit tests using Apollo Client's mocking utilities.

### Example Structure

```
components/
  feature-x/
    my-component.container.graphql
    my-component.container.tsx
    my-component.stories.tsx
    my-component.tsx
```

### References

- [Apollo Client Docs](https://www.apollographql.com/docs/react/)
- [GraphQL Specification](https://spec.graphql.org/)