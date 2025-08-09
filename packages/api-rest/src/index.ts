import type {
	HttpRequest,
	HttpResponseInit,
	InvocationContext,
} from '@azure/functions';
import type { ApplicationServicesFactory } from '@ocom/api-application-services';

//export type HttpHandler = (request: HttpRequest, context: InvocationContext) => Promise<HttpResponseInit>;
export type HttpHandler = (
	_request: HttpRequest,
	_context: InvocationContext,
) => Promise<HttpResponseInit>;

export const restHandlerCreator = (applicationServicesFactory: ApplicationServicesFactory): HttpHandler => {
	// biome-ignore lint:noRequireAwait
	// biome-ignore lint:noUnusedVars
	return async (request: HttpRequest, _context: InvocationContext) => {
		//_request: HttpRequest, _context: InvocationContext
		return Promise.resolve({
			status: 200,
			jsonBody: {
				message: 'Hello World!',
				applicationServices: applicationServicesFactory.forRequest(request.headers.get('Authorization') ?? ''),
			},
		});
	};
};
