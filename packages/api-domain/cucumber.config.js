module.exports = {
  default: {
    // Feature files location
    paths: ['tests/acceptance/features/**/*.feature'],
    
    // Step definitions location
    require: [
      'tests/acceptance/step-definitions/**/*.ts',
      'tests/acceptance/support/serenity.config.ts'
    ],
    
    // TypeScript support
    requireModule: ['tsx/cjs'],
    
    // Format options
    format: [
      'pretty',
      'json:reports/cucumber-report.json',
      'html:reports/cucumber-report.html'
    ],
    
    // Parallel execution
    parallel: 1,
    
    // Retry failed scenarios
    retry: 1,
    
    // Exit on first failure
    failFast: false,
    
    // Tags to run/exclude
    tags: 'not @skip and not @wip',
    
    // World parameters
    worldParameters: {
      environment: process.env.NODE_ENV || 'test'
    }
  }
};
