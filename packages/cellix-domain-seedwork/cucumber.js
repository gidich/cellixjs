const config = {
  require: ['features/step_definitions/**/*.ts', 'features/support/*.ts'],
  requireModule: ['ts-node/register'],
  format: ['@serenity-js/cucumber'],
  formatOptions: { snippetInterface: 'async-await' },
  paths: ['features/**/*.feature'],
  publishQuiet: true
};

export default config;
