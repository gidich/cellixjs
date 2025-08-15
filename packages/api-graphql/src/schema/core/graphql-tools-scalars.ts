/* ensure these remain as require statements as they get called from graphql-code-generator */
const { typeDefs } = await import('graphql-scalars');
const { buildSchema } = await import('graphql');

const scalars = typeDefs.join('\n')

export default buildSchema(scalars);