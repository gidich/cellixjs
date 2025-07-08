const config = {
  loader: ['ts-node/esm'],
  require: ['features/step_definitions/*.ts', 'features/support/*.ts'],
  format: ['progress-bar'],
  formatOptions: { snippetInterface: 'async-await' },
  paths: ['features/*.feature'],
  import: ['features/step_definitions/*.ts'],
  publishQuiet: true
};

// Set ts-node project configuration
process.env.TS_NODE_PROJECT = './cucumber.tsconfig.json';

export default config;