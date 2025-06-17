import Joi from 'joi';
import BaseValidation from './baseValidator';

class AuthValidation extends BaseValidation {
	public login = Joi.object({
		email: this.email(),
		password: this.required('Password'),
	});

	public register = Joi.object({
		email: this.email(),
		password: this.password(),
		phone: this.phone(),
		businessName: this.required('Business name'),
	});

	public resetPassword = Joi.object({
		email: this.email(),
	});

	public changePassword = Joi.object({
		oldPassword: this.required('Current password'),
		newPassword: this.password(),
	});
}

export default new AuthValidation();
