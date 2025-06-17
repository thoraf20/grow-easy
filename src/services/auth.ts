import bcrypt from 'bcrypt';
import { IRegisterRequest, IAuthResponse, ILoginRequest } from '../types/Auth';
import User from '../models/user';
import ApiError from '../abstractions/ApiError';
import { StatusCodes } from 'http-status-codes';
import { generateAccessToken, generateRefreshToken } from '../utils';

export const AuthService = {
	async registerUser(
		userData: IRegisterRequest,
	): Promise<IAuthResponse> {

		const user = await User.create({
			email: userData.email,
			password: userData.password,
			phone: userData.phone,
			businessName: userData.businessName,
		});

		const token = generateAccessToken(user.id);
		const refreshToken = generateAccessToken(user.id);

		return {
			token,
			refreshToken,
			user: {
				id: user.id,
				email: user.email as string,
				businessName: user.businessName as string,
			},
		};
	},

  async login(userData: ILoginRequest): Promise<IAuthResponse> {
		const userExist = await User.findOne({ email: userData.email });
		
		if (!userExist) {
			throw new ApiError('Account does not exist', StatusCodes.NOT_FOUND);
		}

		const isPasswordMatch = bcrypt.compare(userData.password, userExist.password as string);
		
		if (!isPasswordMatch) {
			throw new ApiError('Invalid email or password', StatusCodes.UNAUTHORIZED);
		}
		
    await User.findByIdAndUpdate(userExist.id, {
		lastLogin: new Date(),
	});

    const token = generateAccessToken(userExist.id);
    const refreshToken = generateRefreshToken(userExist.id)
    return {
      token,
      refreshToken,
      user: {
        id: userExist.id,
        email: userExist.email as string,
        businessName: userExist.businessName as string,
      },
    };
  },

	async verifyEmail(email: string, code: string) {
		const userExist = await User.findOne({ email })

		if (!userExist) {
			throw new ApiError('Account does not exist', StatusCodes.NOT_FOUND);
		}

		if (code === "1234") {
			await User.findOneAndUpdate(userExist.id, { isEmailVerified: true })
			return {
				msg: "Email verification successful"
			}
		}
	}
};
