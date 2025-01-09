import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import type { ApiContextSpec } from "api-context-spec";

export type HttpHandler = (request: HttpRequest, context: InvocationContext) => Promise<HttpResponseInit>;

export const restHandlerCreator = (apiContext: ApiContextSpec): HttpHandler => {
  return async (HttpHandler) => {
    return {
      status: 200,
      jsonBody: {
        message: "Hello World!",
        apiContext: apiContext,
      },
    };
  };
};