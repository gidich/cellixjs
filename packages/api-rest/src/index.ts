import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'; 
import type { ApiContextSpec } from '@ocom/api-context-spec';

//export type HttpHandler = (request: HttpRequest, context: InvocationContext) => Promise<HttpResponseInit>;
export type HttpHandler = (  
  _request: HttpRequest,  
  _context: InvocationContext  
) => Promise<HttpResponseInit>; 

export const restHandlerCreator = (apiContext: ApiContextSpec): HttpHandler => {
  return async (_request: HttpRequest, _context: InvocationContext) => { //_request: HttpRequest, _context: InvocationContext
    return {
      status: 200,
      jsonBody: {
        message: "Hello World!",
        apiContext: apiContext,
      },
    };
  };
};