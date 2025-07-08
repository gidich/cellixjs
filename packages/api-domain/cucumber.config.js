module.exports = {
  default: {
    require: ['features/support/*.ts'],
    requireModule: ['ts-node/register'],
    format: ['progress-bar'],
    formatOptions: { snippetInterface: 'async-await' },
    paths: ['features/*.feature'],
    import: ['features/step_definitions/*.ts'],
    loader: ['ts-node/esm'],
    publishQuiet: true
  }
};
