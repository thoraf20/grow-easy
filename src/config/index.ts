import dotenv from 'dotenv';

dotenv.config();

export const config = {
	port: Number(process.env.PORT) || 8080,
	env: process.env.NODE_ENV || 'development',
	jwtSecret: process.env.JWT_SECRET,
	jwtExpiration: process.env.JWT_EXPIRATION || '1h',
	mongodb: {
		uri: process.env.DB_URI || 'mongodb://localhost:27017/ge',
		options: {
			autoIndex: true,
			maxPoolSize: 10,
			serverSelectionTimeoutMS: 5000,
			socketTimeoutMS: 45000,
			family: 4, // Use IPv4
		},
	},
	cors: {
		allowedOrigins: process.env.CORS_ALLOWED_ORIGINS?.split(',') || [],
	},
};