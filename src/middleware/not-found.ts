import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export default function notFoundHandler(req: Request, res: Response): void {
	res.status(StatusCodes.NOT_FOUND).json({
		success: false,
		error: {
			code: StatusCodes.NOT_FOUND,
			message: `Cannot ${req.method} ${req.url}`,
		},
	});
}
