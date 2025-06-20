import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import BaseController from './BaseController';
import { RouteDefinition } from '../types/RouteDefinition';
import ApiError from '../abstractions/ApiError';
import {
	ILoginRequest,
	IRegisterRequest,
	// IAuthResponse,
	// IResetPasswordRequest,
	// IChangePasswordRequest,
} from '../types/Auth';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import AuthValidation from '../shared/validators/auth.validator'
import { AuthService } from '../services/auth';
import User from '../models/user';
import bcrypt from 'bcrypt';
import { config } from '../config';


export default class AuthController extends BaseController {
	public basePath = 'auth';

	public routes(): RouteDefinition[] {
		return [
			{
				path: '/register',
				method: 'post',
				handler: this.register.bind(this),
				middlewares: [validate(AuthValidation.register)],
			},
			{
				path: '/verify-email',
				method: 'post',
				handler: this.verifyEmail.bind(this),
				middlewares: [validate(AuthValidation.verifyEmail)],
			},
			{
				path: '/login',
				method: 'post',
				handler: this.login.bind(this),
				middlewares: [validate(AuthValidation.login)],
			},
			{
				path: '/logout',
				method: 'post',
				handler: this.logout.bind(this),
				middlewares: [authMiddleware, validate(AuthValidation.login)],
			},
			// {
			// 	path: '/reset-password',
			// 	method: 'post',
			// 	handler: this.resetPassword.bind(this),
			// },
			// {
			// 	path: '/change-password',
			// 	method: 'put',
			// 	handler: this.changePassword.bind(this),
			// 	middlewares: [this.authMiddleware],
			// },
		];
	}

	public async register(
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		try {
			const { email, phone, password, businessName }: IRegisterRequest = req.body;

      const existingUser = await User.findOne({ email });
                
      if (existingUser) {
        throw new ApiError(
          'Email already registered',
          StatusCodes.CONFLICT,
        )
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

			const response = await AuthService.registerUser({
				email,
				phone,
				password: hashedPassword,
				businessName,
			});

      res.cookie('refreshToken', response.refreshToken, { httpOnly: true, secure: config.env === 'production'})

			return res.status(StatusCodes.CREATED).json({ msg: "User registered successfully, use 1234 to verify email", data: response });
			// super.send(res, response, StatusCodes.CREATED);
		} catch (error) {
			next(error);
		}
	}

	public async verifyEmail(req: Request, res: Response, next: NextFunction) {
	 try {
		const { email, code } = req.body
		const response = await AuthService.verifyEmail(email, code)

		super.send(res, response, StatusCodes.OK);
	 } catch (error) {
		next(error)
	 }
	}

	public async login(req: Request, res: Response, next: NextFunction) {
		try {
			const { email, password }: ILoginRequest = req.body;

      const response = await AuthService.login({ email, password })

			res.locals.data = response;
      res.cookie('refreshToken', response.refreshToken, { httpOnly: true, secure: config.env === 'production'})
			super.send(res, response, StatusCodes.OK);
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
      res.clearCookie('refreshToken')
			super.send(
				res,
				{ message: 'Logged out successfully' },
				StatusCodes.OK,
			);
		} catch (error) {
			next(error);
		}
	}

	// public async resetPassword(
	// 	req: Request,
	// 	res: Response,
	// 	next: NextFunction,
	// ): Promise<void> {
	// 	try {
	// 		const { email }: IResetPasswordRequest = req.body;

	// 		// Add your password reset logic here
	// 		super.send(
	// 			res,
	// 			{ message: 'Password reset email sent' },
	// 			StatusCodes.OK,
	// 		);
	// 	} catch (error) {
	// 		next(error);
	// 	}
	// }

	// public async changePassword(
	// 	req: Request,
	// 	res: Response,
	// 	next: NextFunction,
	// ): Promise<void> {
	// 	try {
	// 		const { oldPassword, newPassword }: IChangePasswordRequest =
	// 			req.body;

	// 		// Add your password change logic here
	// 		super.send(
	// 			res,
	// 			{ message: 'Password changed successfully' },
	// 			StatusCodes.OK,
	// 		);
	// 	} catch (error) {
	// 		next(error);
	// 	}
	// }
}
