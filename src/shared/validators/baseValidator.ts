import Joi from 'joi';

export default abstract class BaseValidation {
	protected required(label?: string): Joi.StringSchema {
		return Joi.string()
			.required()
			.messages({
				'any.required': `${label || 'Field'} is required`,
				'string.empty': `${label || 'Field'} cannot be empty`,
			});
	}

	protected email(): Joi.StringSchema {
		return Joi.string().email().required().messages({
			'string.email': 'Please enter a valid email address',
			'any.required': 'Email is required',
		});
	}

	protected password(): Joi.StringSchema {
		return Joi.string()
			.min(8)
			.max(30)
			.pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])'))
			.required()
			.messages({
				'string.min': 'Password must be at least 8 characters',
				'string.max': 'Password must not exceed 30 characters',
				'string.pattern.base':
					'Password must contain at least one uppercase letter, one lowercase letter, and one number',
				'any.required': 'Password is required',
			});
	}

	protected phone(): Joi.StringSchema {
		return Joi.string()
			.pattern(new RegExp('^[0-9]{10}$'))
			.required()
			.messages({
				'string.pattern.base':
					'Please enter a valid 10-digit phone number',
				'any.required': 'Phone number is required',
			});
	}
}
