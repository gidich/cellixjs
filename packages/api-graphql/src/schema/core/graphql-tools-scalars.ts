/* ensure these remain as require statements as they get called from graphql-code-generator */
import { buildSchema } from 'graphql';
import { typeDefs} from 'graphql-scalars';

const scalars = typeDefs.join('\n')
export default buildSchema(scalars);