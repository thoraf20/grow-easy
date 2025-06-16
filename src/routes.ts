import { Router } from 'express';
import logger from './lib/logger';
import { RouteDefinition } from './types/RouteDefinition';
import AuthController from './controller/auth';

function registerControllerRoutes(routes: RouteDefinition[]): Router {
	const controllerRouter = Router();

	routes.forEach((route) => {
		const { method, path, handler, middlewares = [] } = route;

		if (!controllerRouter[method]) {
			throw new Error(`Invalid HTTP method: ${method}`);
		}

		controllerRouter[method](path, ...middlewares, handler);
	});

	return controllerRouter;
}

export default function registerRoutes(): Router {
	const router = Router();

	try {
		// Define controllers
		const controllers = [
			new AuthController(),
			// Add other controllers here
		];

		// Register routes for each controller
		controllers.forEach((controller) => {
			if (
				!controller.basePath ||
				typeof controller.routes !== 'function'
			) {
				throw new Error(
					`Invalid controller configuration for ${controller.constructor.name}`,
				);
			}

			const controllerRouter = registerControllerRoutes(
				controller.routes(),
			);
			router.use(`/v1/${controller.basePath}`, controllerRouter);
		});

		return router;
	} catch (error) {
		logger.error('Failed to register routes:', error);
		throw error; // Re-throw to handle it in the global error handler
	}
}
