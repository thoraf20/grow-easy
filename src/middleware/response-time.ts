import { Request, Response, NextFunction } from 'express';
import logger from '../lib/logger';

export default function responseTime() {
	return (req: Request, res: Response, next: NextFunction): void => {
		const start = process.hrtime();

		res.on('end', () => {
			try {
				if (!res.headersSent) {
					const diff = process.hrtime(start);
					const time = diff[0] * 1e3 + diff[1] * 1e-6;
					res.setHeader('X-Response-Time', `${time.toFixed(2)}ms`);
				}
			} catch (error) {
				logger.error('Error setting response time header:', error);
			}
		});

		// Set header before any potential response
		res.setHeader('X-Response-Time', '0ms');
		next();
	};
}
