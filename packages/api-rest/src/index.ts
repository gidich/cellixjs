import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { StartupObject } from "api-services-spec";

export type HttpHandler = (request: HttpRequest, context: InvocationContext) => Promise<HttpResponseInit>;

export const restHandlerCreator = (startupObject: StartupObject): HttpHandler => {
  return async (HttpHandler) => {
    return {
      status: 200,
      jsonBody: {
        message: "Hello World!",
        startupObject: startupObject,
      },
    };
  };
};