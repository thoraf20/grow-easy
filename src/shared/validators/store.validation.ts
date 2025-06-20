import Joi from 'joi';
import BaseValidation from './baseValidator';


class StoreValidation extends BaseValidation {
	public createStoreFront = Joi.object({
		name: Joi.string().min(3).required(),
		bio: Joi.string().max(500).required(),
		logo: Joi.string().uri().optional().allow(''),
	});

	public updateStoreFront = Joi.object({
		name: Joi.string().min(3).optional(),
		bio: Joi.string().max(500).optional(),
		logo: Joi.string().uri().optional(),
	});
}

export default new StoreValidation();