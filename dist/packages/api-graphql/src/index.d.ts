import { HttpHandler } from "@azure/functions-v4";
import type { ApiContextSpec } from 'api-context-spec';
export declare const graphHandlerCreator: (apiContext: ApiContextSpec) => HttpHandler;
