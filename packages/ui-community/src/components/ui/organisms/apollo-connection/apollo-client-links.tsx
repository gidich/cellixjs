import { ApolloClient, ApolloLink, type DefaultContext, from, InMemoryCache } from '@apollo/client';
import { BatchHttpLink } from '@apollo/client/link/batch-http';
import { setContext } from '@apollo/client/link/context';
import type { UriFunction } from '@apollo/client/link/http';
import { removeTypenameFromVariables } from '@apollo/client/link/remove-typename';
import type { AuthContextProps } from 'react-oidc-context';

// apollo client instance
export const client = new ApolloClient({
  cache: new InMemoryCache(),
  // biome-ignore lint:useLiteralKeys
  connectToDevTools: import.meta.env['NODE_ENV'] !== 'production'
});


// base apollo link with no customizations
// could be used as a base for the link chain
export const BaseApolloLink = (): ApolloLink => setContext((_, { headers }) => {
  return {
    headers: {
      ...headers
    }
  };
});


// apollo link to add auth header
export const ApolloLinkToAddAuthHeader = (auth: AuthContextProps): ApolloLink => 
  setContext((_, { headers }) => {
    const access_token = auth.isAuthenticated ? auth.user?.access_token : undefined;
    return {
      headers: {
        ...headers,
        ...(access_token && { Authorization: `Bearer ${access_token}` })
      }
    };
  });
// alternate way to add auth header
export const ApolloLinkToAddAuthHeader1 = (auth: AuthContextProps): ApolloLink => new ApolloLink((operation, forward) => {;
  const access_token = (auth.isAuthenticated) ? auth.user?.access_token : undefined;
  if(!access_token) {
    return forward(operation);
  }
  operation.setContext((prevContext: DefaultContext) => { 
    // biome-ignore lint:useLiteralKeys
    prevContext['headers']["Authorization"] = `Bearer ${access_token}`;
    return prevContext;
  });
  return forward(operation);
});
// alternate way to add auth header
export const ApolloLinkToAddAuthHeader2 = (auth: AuthContextProps): ApolloLink => {
  return setContext((_, { headers }) => { 
    const returnHeaders = { ...headers };
    const access_token = (auth.isAuthenticated === true) ? auth.user?.access_token : undefined;
    if (access_token) {
      // biome-ignore lint:useLiteralKeys
      returnHeaders['Authorization'] = `Bearer ${access_token}`;
    }
    return { headers: returnHeaders };
  });
};


// apollo link to add custom header
export const ApolloLinkToAddCustomHeader = (headerName: string, headerValue: string | null | undefined, ifTrue?: boolean): ApolloLink => new ApolloLink((operation, forward) => {
  if(!headerValue || (ifTrue !== undefined && ifTrue === false)) {
    return forward(operation);
  }
  operation.setContext((prevContext: DefaultContext) => { 
    // biome-ignore lint:useLiteralKeys
    prevContext['headers'][headerName] = headerValue;
    return prevContext;
  });
  return forward(operation);
});


// apollo link to batch graphql requests
// includes removeTypenameFromVariables link
export const TerminatingApolloLinkForGraphqlServer= (config: BatchHttpLink.Options) => {
  const batchHttpLink = new BatchHttpLink({
    uri: config.uri as string | UriFunction,
    batchMax: Number(config.batchMax), // No more than 15 operations per batch
    batchInterval: Number(config.batchInterval) // Wait no more than 50ms after first batched operation
  });
  return from([removeTypenameFromVariables(), batchHttpLink]);
};