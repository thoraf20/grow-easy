import dotenv from 'dotenv';

dotenv.config();

export const config = {
	port: Number(process.env.PORT) || 8080,
	env: process.env.NODE_ENV || 'development',
	dbUrl: process.env.DB_URL || 'mongodb://localhost:27017/myapp',
	jwtSecret: process.env.JWT_SECRET,
	cors: {
		allowedOrigins: process.env.CORS_ALLOWED_ORIGINS?.split(',') || [],
	}
};