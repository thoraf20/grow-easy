import { Request, Response, NextFunction } from 'express';

export default function responseTime() {
	return (req: Request, res: Response, next: NextFunction): void => {
		const start = process.hrtime();

		res.on('finish', () => {
			const diff = process.hrtime(start);
			const time = diff[0] * 1e3 + diff[1] * 1e-6;
			res.setHeader('X-Response-Time', `${time.toFixed(2)}ms`);
		});

		next();
	};
}
