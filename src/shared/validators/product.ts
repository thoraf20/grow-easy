import Joi from 'joi';
import BaseValidation from './baseValidator';


class ProductValidation extends BaseValidation {
	public createProduct = Joi.object({
		name: Joi.string().min(3).required(),
		description: Joi.string().max(500).required(),
		price: Joi.number().min(0).required(),
		imageUrl: Joi.string().uri().optional().allow(''),
		inStock: Joi.boolean().required(),
	});

	public updateProduct = Joi.object({
		name: Joi.string().min(3).optional(),
		description: Joi.string().max(500).optional(),
		price: Joi.number().min(0).optional(),
		imageUrl: Joi.string().uri().optional().allow(''),
		inStock: Joi.boolean().optional(),
	});
}

export default new ProductValidation();