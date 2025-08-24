/* ensure these remain as require statements as they get called from graphql-code-generator */
// biome-ignore lint:noCommonJs
const { typeDefs } = require('graphql-scalars');
// biome-ignore lint:noCommonJs
const { buildSchema } = require('graphql');

const scalars = typeDefs.join('\n')
// biome-ignore lint:noCommonJs
module.exports = buildSchema(scalars);