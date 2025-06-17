import bcrypt from 'bcrypt';
import { IRegisterRequest, IAuthResponse, ILoginRequest } from '../types/Auth';
import User from '../models/user';
import ApiError from '../abstractions/ApiError';
import { StatusCodes } from 'http-status-codes';
import { generateAccessToken } from '../utils';

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

		return {
			token,
			user: {
				id: user.id,
				email: user.email as string,
				businessName: user.businessName as string,
			},
		};
	},

  async login(userData: ILoginRequest): Promise<IAuthResponse> {
    const userExist = await User.findOne({ email: userData.email })

    if(!userExist) {
      throw new ApiError('Invalid email or password', StatusCodes.UNAUTHORIZED);
    }

    const isPasswordMatch = bcrypt.compare(userData.password, userExist.password as string)

    if (!isPasswordMatch) {
      throw new ApiError('Invalid email or password', StatusCodes.UNAUTHORIZED);
    }

    await User.findByIdAndUpdate(userExist.id, {
      lastLogin: new Date(),
    });

    const token = generateAccessToken(userExist.id);

    return {
      token,
      user: {
        id: userExist.id,
        email: userExist.email as string,
        businessName: userExist.businessName as string,
      },
    };
  }
};
