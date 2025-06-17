import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../abstractions/ApiError';

export const validate = (schema: Schema) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			// Validate the request body
			const validatedData = await schema.validateAsync(req.body, {
				abortEarly: false,
				allowUnknown: true,
				stripUnknown: true,
			});

			// Replace request body with validated data
			req.body = validatedData;

			return next();
		} catch (error) {
			if (error.isJoi) {
				// Format validation errors
				const errors = error.details.map((detail: any) => ({
					field: detail.path.join('.'),
					message: detail.message,
				}));

				// Send validation error response
				res.status(StatusCodes.BAD_REQUEST).json({
					success: false,
					message: 'Validation failed',
					errors: errors,
				});
			} else {
				// Handle unexpected errors
				next(
					new ApiError(
						'Internal server error',
						StatusCodes.INTERNAL_SERVER_ERROR,
					),
				);
			}
		}
	};
};
