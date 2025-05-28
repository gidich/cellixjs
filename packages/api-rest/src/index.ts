import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import type { ApiContextSpec } from 'api-context-spec';

export type HttpHandler = (request: HttpRequest, context: InvocationContext) => Promise<HttpResponseInit>;

export const restHandlerCreator = (apiContext: ApiContextSpec): HttpHandler => {
  return async (_request: HttpRequest, _context: InvocationContext) => {
    return {
      status: 200,
      jsonBody: {
        message: "Hello World!",
        apiContext: apiContext,
      },
    };
  };
};