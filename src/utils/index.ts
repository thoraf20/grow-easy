import jwt from 'jsonwebtoken';
import { config } from '../config';
import { encrypt } from '../lib/crypto';

export function getEncryptedText<T>(input: T): T | string {
	const APPLY_ENCRYPTION = process.env.APPLY_ENCRYPTION === 'true';
	const { SECRET_KEY } = process.env;

	// Encrypt only if encryption is enabled and secret key is provided
	if (APPLY_ENCRYPTION && SECRET_KEY) {
		// Convert input to JSON string if it's not already a string
		const output =
			typeof input === 'string' ? input : JSON.stringify(input);
		return encrypt(output, SECRET_KEY);
	}

	return input;
}

export const generateAccessToken = (userId: string): string => {
	const { jwtSecret } = config;

	if (!jwtSecret) {
		throw new Error('JWT secret is not defined');
	}
	return jwt.sign({ id: userId }, jwtSecret, { expiresIn: '1h' });
}

export const generateRefreshToken = (userId: string): string => {
	const { jwtSecret } = config;

	if (!jwtSecret) {
		throw new Error('JWT secret is not defined');
	}
	return jwt.sign({ id: userId }, jwtSecret, { expiresIn: '7d' });
}

export const verifyToken = (token: string): Promise<any> => {
	const { jwtSecret } = config;
	if (!jwtSecret) {
		throw new Error('JWT secret is not defined');
	}
	return new Promise((resolve, reject) => {
		jwt.verify(token, jwtSecret, (err, decoded) => {
			if (err) {
				return reject(err);
			}
			resolve(decoded);
		});
	});
}