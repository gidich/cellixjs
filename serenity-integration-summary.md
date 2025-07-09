# Serenity-JS Integration with Community Steps

## Summary

I have successfully added Serenity-JS to the api-domain project and updated the `community.steps.ts` file to use the Serenity Screenplay pattern while maintaining Jest mock functionality as requested.

## What was implemented:

### 1. Updated community.steps.ts with Serenity Pattern

- **Replaced simple test context** with Serenity's memory management pattern
- **Added Serenity Tasks**: 
  - `SetupCommunityCreationContext` - Sets up test data and mock objects
  - `CreateCommunity` - Creates a community with valid data
  - `AttemptToCreateCommunityWithInvalidName` - Creates a community with invalid data
- **Added Serenity Questions**:
  - `TheCommunityCreationResult()` - Queries the creation result
  - `TheCommunityCreationError()` - Queries any creation errors
  - `TheCreatedCommunity()` - Queries the created community instance
  - `TheCommunityEvents()` - Queries raised domain events
  - `TheExpectedCommunityId()` - Queries expected community ID
- **Updated Cucumber Steps** to use Serenity actors and async/await pattern
- **Maintained Jest mock functionality** as requested (kept jest-mock import and usage)

### 2. Configuration Updates

- **Updated cucumber.config.js** to include `@serenity-js/cucumber` formatter
- **Updated features/support/setup.ts** to configure Serenity for Cucumber tests
- **Updated @serenity-js/cucumber** from v2.24.0 to v3.32.3 for compatibility
- **All Serenity dependencies** are properly aligned at v3.32.x

### 3. Testing Results

- **Cucumber tests pass**: Both scenarios run successfully with Serenity integration
- **Jest tests pass**: Existing Jest tests continue to work with Serenity BDD reporter
- **Serenity reports generated**: HTML reports are available at `target/site/serenity/index.html`
- **Both frameworks coexist**: Jest for unit testing, Serenity for BDD/Cucumber acceptance testing

## Key Features Implemented

### ✅ Serenity Screenplay Pattern
- **Actors**: `communityAdmin = actorCalled('Community Admin')`
- **Tasks**: Business-level actions like `SetupCommunityCreationContext.with(...)`
- **Questions**: State queries like `TheCommunityCreationResult()`
- **Memory Management**: `remember()`, `recall()`, `clearMemory()` pattern

### ✅ Jest Mock Integration  
- **Maintained jest-mock**: All existing Jest mocking functionality preserved
- **Mock objects**: Community visa, passport, and domain entities using `jest.mocked()`
- **No breaking changes**: Existing test mocks continue to work

### ✅ Cucumber BDD Integration
- **Gherkin scenarios**: Feature files work with Serenity actors
- **Step definitions**: Updated to use async/await and Serenity patterns
- **Background steps**: Proper setup for test contexts

### ✅ Dual Reporting
- **Jest coverage reports**: Standard Jest test reporting for unit tests
- **Serenity BDD reports**: Rich HTML reports with test execution details, living documentation

## Code Structure

```typescript
// Serenity Memory Management
const remember = (key: string, value: any) => testMemory.set(key, value);
const recall = <T>(key: string): T => testMemory.get(key);

// Serenity Tasks (Business Actions)
class SetupCommunityCreationContext extends Task {
  performAs(_actor: Actor): Promise<void> {
    // Uses jest.mocked() for test doubles
    const mockCommunityVisa = jest.mocked({...});
    return Promise.resolve();
  }
}

// Serenity Questions (State Queries)  
const TheCommunityCreationResult = () => 
  Question.about<string>('the result of the community creation attempt', () => {
    return recall<string>('communityCreationResult');
  });

// Cucumber Steps with Serenity
When('I create a new community', async () => {
  await communityAdmin.attemptsTo(CreateCommunity.withValidData());
});

Then('the community should be created successfully', async () => {
  const result = await communityAdmin.answer(TheCommunityCreationResult());
  expect(result).toBe('success');
});
```

## How to Run

### Cucumber Tests with Serenity
```bash
cd packages/api-domain
npx cucumber-js "features/**/*.feature" --require "features/step_definitions/**/*.ts" --format @serenity-js/cucumber
```

### Jest Tests with Serenity
```bash
cd packages/api-domain  
npm run test:serenity
```

### Generate Serenity Reports
```bash
cd packages/api-domain
npm run serenity:report
```

## Files Modified

1. **`features/step_definitions/community.steps.ts`** - Updated to use Serenity pattern
2. **`cucumber.config.js`** - Added Serenity formatter
3. **`features/support/setup.ts`** - Added Serenity configuration
4. **`package.json`** - Updated Serenity Cucumber dependency

## Benefits Achieved

- **Living Documentation**: Serenity generates rich HTML reports showing test scenarios
- **Business-Readable Tests**: Screenplay pattern makes tests more expressive
- **Dual Framework Support**: Jest for unit tests, Serenity for acceptance tests
- **Maintained Backwards Compatibility**: All existing Jest mocks continue to work
- **Enhanced Reporting**: Beautiful HTML reports with test execution details

The integration successfully demonstrates how Serenity-JS can enhance the existing testing infrastructure while preserving the investment in Jest mocking patterns.
