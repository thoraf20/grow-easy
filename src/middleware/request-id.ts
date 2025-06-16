import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

export default function requestId() {
	return (req: Request, res: Response, next: NextFunction): void => {
		const id = req.headers['x-request-id'] || uuidv4();
		req['id'] = id;
		res.setHeader('X-Request-Id', id);
		next();
	};
}
