import express, { Application } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import registerRoutes from './routes';
import { errorHandler } from './middleware/error-handler';
import notFoundHandler from './middleware/not-found';
import requestId from './middleware/request-id';
import responseTime from './middleware/response-time';
import logger from './lib/logger';
import { connectDB, disconnectDB } from './config/db';

export default class App {
	public express: Application;
	private httpServer: http.Server;

	constructor() {
		this.express = express();
	}

	public async init(): Promise<void> {
		try {
			// Initialize Express
			this.configureMiddleware();
			this.configureRoutes();
			this.configureErrorHandling();

			// Create HTTP server
			this.httpServer = http.createServer(this.express);

			// Additional initialization tasks can go here
			// For example: database connections, cache setup, etc.
			await this.initializeServices();

			logger.info('Application initialized successfully');
		} catch (error) {
			logger.error('Failed to initialize application:', error);
			throw error;
		}
	}

	private async initializeServices(): Promise<void> {
		try {
			// Add your service initializations here
			await connectDB();
			// await cache.connect();
			// await messageQueue.connect();

			logger.info('Services initialized successfully');
		} catch (error) {
			logger.error('Failed to initialize services:', error);
			throw error;
		}
	}

	public getHttpServer(): http.Server {
		return this.httpServer;
	}

	private configureMiddleware(): void {
		this.express.set('trust proxy', [
			'loopback', // localhost
			'linklocal',
			'uniquelocal',
			// Add your proxy IPs here, for example:
			// '192.168.1.0/24'
		]);

		// Request tracking
		this.express.use(requestId());
		this.express.use(responseTime());

		// Security
		this.express.use(
			helmet({
				contentSecurityPolicy: config.env === 'production',
				crossOriginEmbedderPolicy: config.env === 'production',
			}),
		);
		

		// CORS
		this.express.use(
			cors({
				origin: config.cors.allowedOrigins,
				methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
				allowedHeaders: ['Content-Type', 'Authorization'],
				exposedHeaders: ['X-Request-Id', 'X-Response-Time'],
				credentials: true,
				maxAge: 86400, // 24 hours
			}),
		);

		// Request parsing
		this.express.use(
			express.json({
				limit: '10mb',
				verify: (req, res, buf) => {
					req['rawBody'] = buf.toString();
				},
			}),
		);
		this.express.use(
			express.urlencoded({
				extended: true,
				limit: '10mb',
			}),
		);

		// Compression
		this.express.use(
			compression({
				filter: (req, res) => {
					if (req.headers['x-no-compression']) {
						return false;
					}
					return compression.filter(req, res);
				},
				level: 6, // default compression level
			}),
		);

		// Logging
		if (config.env !== 'test') {
			this.express.use(
				morgan(
					'[:date[clf]] :method :url :status :response-time ms - :res[content-length]',
				),
			);
		}

		// Trust proxy
		this.express.enable('trust proxy');
	}

	private configureRoutes(): void {
	
		this.express.get('/health', (_req, res) => {
			if (!res.headersSent) {
				res.status(200).json({
					status: 'healthy',
					timestamp: new Date().toISOString(),
				});
			}
		});

		this.express.use(
			rateLimit({
				windowMs: 15 * 60 * 1000, // 15 minutes
				max: 100, // limit each IP to 100 requests per windowMs
				message: 'Too many requests from this IP, please try again later',
				standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
				legacyHeaders: false, // Disable the `X-RateLimit-*` headers
				// Use a custom handler to get the real IP
				keyGenerator: (req) => {
					return req.ip; // This will now use the properly trusted IP
				},
			}),
		);

		this.express.use('/api', registerRoutes());
	}

	private configureErrorHandling(): void {
		this.express.use(notFoundHandler);

		// Global  handler
		this.express.use(errorHandler);
	}

	public async shutdown(): Promise<void> {
		try {
			// Gracefully close all connections and cleanup
			if (this.httpServer) {
				await new Promise<void>((resolve, reject) => {
					this.httpServer.close((err) => {
						if (err) reject(err);
						resolve();
					});
				});
			}

			// Add cleanup for other services
			await disconnectDB();
			// await cache.disconnect();
			// await messageQueue.disconnect();

			logger.info('Application shut down successfully');
		} catch (error) {
			logger.error('Error during application shutdown:', error);
			throw error;
		}
	}
}
