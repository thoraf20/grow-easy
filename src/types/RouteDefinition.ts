import { RequestHandler } from 'express';

export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export interface RouteDefinition {
	path: string;
	method: HttpMethod;
	handler: RequestHandler;
	middlewares?: RequestHandler[];
	validate?: {
		body?: unknown;
		query?: unknown;
		params?: unknown;
	};
}
