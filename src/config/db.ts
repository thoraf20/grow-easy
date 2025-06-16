import mongoose from 'mongoose';
import logger from '../lib/logger';
import { config } from './index';

export async function connectDB(): Promise<void> {
	try {
		await mongoose.connect(config.mongodb.uri, config.mongodb.options);
		logger.info('MongoDB Connected Successfully');

		mongoose.connection.on('error', (err) => {
			logger.error('MongoDB connection error:', err);
		});

		mongoose.connection.on('disconnected', () => {
			logger.warn('MongoDB disconnected. Trying to reconnect...');
		});
	} catch (error) {
		logger.error('Failed to connect to MongoDB:', error);
		process.exit(1);
	}
}

export async function disconnectDB(): Promise<void> {
	try {
		await mongoose.disconnect();
		logger.info('MongoDB Disconnected Successfully');
	} catch (error) {
		logger.error('Error disconnecting from MongoDB:', error);
		throw error;
	}
}
