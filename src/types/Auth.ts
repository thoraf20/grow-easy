export interface ILoginRequest {
	email: string;
	password: string;
}

export interface IRegisterRequest extends ILoginRequest {
	email: string;
	password: string;
	phone: string;
	businessName: string;
}

export interface IAuthResponse {
	token: string;
	user: {
		id: string;
		email: string;
		businessName: string
	};
}

export interface IResetPasswordRequest {
	email: string;
}

export interface IChangePasswordRequest {
	oldPassword: string;
	newPassword: string;
}
