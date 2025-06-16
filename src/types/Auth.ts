export interface ILoginRequest {
	email: string;
	password: string;
}

export interface IRegisterRequest extends ILoginRequest {
	name: string;
}

export interface IAuthResponse {
	token: string;
	user: {
		id: string;
		name: string;
		email: string;
	};
}

export interface IResetPasswordRequest {
	email: string;
}

export interface IChangePasswordRequest {
	oldPassword: string;
	newPassword: string;
}
