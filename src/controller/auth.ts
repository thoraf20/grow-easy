import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import BaseController from './BaseController';
import { RouteDefinition } from '../types/RouteDefinition';
import ApiError from '../abstractions/ApiError';
import {
	ILoginRequest,
	IRegisterRequest,
	IAuthResponse,
	IResetPasswordRequest,
	IChangePasswordRequest,
} from '../types/Auth';

export default class AuthController extends BaseController {
	public basePath = 'auth';

	public routes(): RouteDefinition[] {
		return [
			{
				path: '/login',
				method: 'post',
				handler: this.login.bind(this),
			},
			{
				path: '/register',
				method: 'post',
				handler: this.register.bind(this),
			},
			{
				path: '/logout',
				method: 'post',
				handler: this.logout.bind(this),
				middlewares: [this.authMiddleware],
			},
			{
				path: '/reset-password',
				method: 'post',
				handler: this.resetPassword.bind(this),
			},
			{
				path: '/change-password',
				method: 'put',
				handler: this.changePassword.bind(this),
				middlewares: [this.authMiddleware],
			},
		];
	}

	private authMiddleware(
		req: Request,
		res: Response,
		next: NextFunction,
	): void {
		const authHeader = req.headers.authorization;
		if (!authHeader) {
			next(new ApiError('Unauthorized', StatusCodes.UNAUTHORIZED));
			return;
		}
		// Add your JWT verification logic here
		next();
	}

	public async login(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { email, password }: ILoginRequest = req.body;

			// Add your login logic here
			// Example response:
			const response: IAuthResponse = {
				token: 'sample-jwt-token',
				user: {
					id: '1',
					name: 'John Doe',
					email: email,
				},
			};

			res.locals.data = response;
			super.send(res, response, StatusCodes.OK);
		} catch (error) {
			next(error);
		}
	}

	public async register(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { email, password, name }: IRegisterRequest = req.body;

			// Add your registration logic here
			// Example response:
			const response: IAuthResponse = {
				token: 'sample-jwt-token',
				user: {
					id: '1',
					name: name,
					email: email,
				},
			};

			res.locals.data = response;
			super.send(res, response, StatusCodes.CREATED);
		} catch (error) {
			next(error);
		}
	}

	public async logout(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			// Add your logout logic here
			super.send(
				res,
				{ message: 'Logged out successfully' },
				StatusCodes.OK,
			);
		} catch (error) {
			next(error);
		}
	}

	public async resetPassword(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { email }: IResetPasswordRequest = req.body;

			// Add your password reset logic here
			super.send(
				res,
				{ message: 'Password reset email sent' },
				StatusCodes.OK,
			);
		} catch (error) {
			next(error);
		}
	}

	public async changePassword(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { oldPassword, newPassword }: IChangePasswordRequest =
				req.body;

			// Add your password change logic here
			super.send(
				res,
				{ message: 'Password changed successfully' },
				StatusCodes.OK,
			);
		} catch (error) {
			next(error);
		}
	}
}
