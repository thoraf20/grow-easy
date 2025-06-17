import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../abstractions/ApiError';
import logger from '../lib/logger';

export const errorHandler = (
	error: Error | ApiError,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	if (res.headersSent) {
		return next(error);
	}

	const statusCode =
		error instanceof ApiError
			? error.status
			: StatusCodes.INTERNAL_SERVER_ERROR;

	logger.error(error);

	res.status(statusCode).json({
		success: false,
		message: error.message || 'Internal server error',
		errors: error instanceof ApiError ? error.name : undefined,
	});
};
