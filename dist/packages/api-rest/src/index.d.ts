import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import type { ApiContextSpec } from "api-context-spec";
export type HttpHandler = (request: HttpRequest, context: InvocationContext) => Promise<HttpResponseInit>;
export declare const restHandlerCreator: (apiContext: ApiContextSpec) => HttpHandler;
