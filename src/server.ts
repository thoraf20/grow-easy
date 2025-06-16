import * as http from 'http';
import { AddressInfo } from 'net';
import App from './App';
import logger from './lib/logger';
import { config } from './config';

class Server {
	private app: App;
	private server: http.Server;
	private port: number;

	constructor() {
		this.app = new App();
		this.port = config.port || 8080;
	}

	private handleServerError(error: NodeJS.ErrnoException): void {
		if (error.syscall !== 'listen') {
			throw error;
		}

		const bind =
			typeof this.port === 'string'
				? `Pipe ${this.port}`
				: `Port ${this.port}`;

		// handle specific listen errors with friendly messages
		switch (error.code) {
			case 'EACCES':
				logger.error(`${bind} requires elevated privileges`);
				process.exit(1);
				break;
			case 'EADDRINUSE':
				logger.error(`${bind} is already in use`);
				process.exit(1);
				break;
			default:
				throw error;
		}
	}

	private handleServerListening(): void {
		const addressInfo = this.server.address() as AddressInfo;
		logger.info(
			`Server running at http://${addressInfo.address}:${addressInfo.port} in ${config.env} mode`,
		);
	}

	private setupGracefulShutdown(): void {
		// Handle graceful shutdown
		const signals = ['SIGTERM', 'SIGINT'];

		for (const signal of signals) {
			process.on(signal, () => {
				logger.info(
					`${signal} signal received. Starting graceful shutdown...`,
				);

				this.server.close((err) => {
					if (err) {
						logger.error('Error during server closure:', err);
						process.exit(1);
					}

					logger.info('Server closed successfully');
					process.exit(0);
				});

				// Force shutdown after 30 seconds
				setTimeout(() => {
					logger.error('Forced shutdown after 30s timeout');
					process.exit(1);
				}, 30000);
			});
		}
	}

	private setupUnhandledRejectionHandler(): void {
		process.on('unhandledRejection', (reason: Error) => {
			logger.error('Unhandled Promise Rejection:', reason);
			// Crash on unhandled rejections in development
			if (config.env === 'development') {
				process.exit(1);
			}
		});

		process.on('uncaughtException', (error: Error) => {
			logger.error('Uncaught Exception:', error);
			process.exit(1);
		});
	}

	public async start(): Promise<void> {
		try {
			await this.app.init();

			this.app.express.set('port', this.port);
			this.server = this.app.getHttpServer();

			// Setup error handlers
			this.server.on('error', this.handleServerError.bind(this));
			this.server.on('listening', this.handleServerListening.bind(this));

			// Setup graceful shutdown
			this.setupGracefulShutdown();

			// Setup unhandled rejection handler
			this.setupUnhandledRejectionHandler();

			// Start the server
			this.server.listen(this.port);
		} catch (error) {
			logger.error('Failed to start server:', error);
			process.exit(1);
		}
	}
}

// Start the server
const server = new Server();
server.start().catch((error) => {
	logger.error('Server startup error:', error);
	process.exit(1);
});
