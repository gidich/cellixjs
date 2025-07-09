module.exports = {
  default: {
    // Feature files location
    paths: ['features/**/*.feature'],
    
    // Step definitions and support files
    require: [
      'features/step_definitions/**/*.ts',
      'features/support/**/*.ts'
    ],
    
    // TypeScript support with ESM compatibility
    loader: ['tsx/esm'],
    
    // Serenity-JS formatter
    format: ['@serenity-js/cucumber'],
    
    // Format options
    formatOptions: { snippetInterface: 'async-await' },
    
    // Suppress publish message
    publishQuiet: true
  }
};
