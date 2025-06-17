import { Request, Response, NextFunction } from 'express';
import { RouteDefinition } from '../types/RouteDefinition';

export default abstract class BaseController {
	abstract basePath: string;

	abstract routes(): RouteDefinition[];

	protected send<T>(res: Response, data: T, statusCode = 200): void {
		if (!res.headersSent) {
			res.status(statusCode).json({
				success: true,
				data,
			});
		}
	}

	protected handleError(
		error: Error,
		req: Request,
		res: Response,
		next: NextFunction,
	): void {
		next(error);
	}

	protected asyncHandler(
		fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
	) {
		return (
			req: Request,
			res: Response,
			next: NextFunction,
		): Promise<void> => {
			return Promise.resolve(fn(req, res, next)).catch(next);
		};
	}
}
