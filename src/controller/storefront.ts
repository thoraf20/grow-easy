import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import BaseController from './BaseController';
import { StorefrontService } from '../services/storefront';
import { RouteDefinition } from '../types/RouteDefinition';
import { validate } from '../middleware/validate';
import storeValidation from '../shared/validators/store.validation';
import { authMiddleware } from '../middleware/auth';
import { uploadImageToCloudinary } from '../helper/uploadImage';

export default class StoreFrontController extends BaseController {
	public basePath = 'storefront';

	public routes(): RouteDefinition[] {
		return [
			{
				path: '/',
				method: 'post',
				handler: this.createStorefront.bind(this),
				middlewares: [
					authMiddleware,
					validate(storeValidation.createStoreFront),
				],
			},
			{
				path: '/:slug',
				method: 'get',
				handler: this.getPublicStoreFront.bind(this),
				middlewares: [authMiddleware],
			},
			{
				path: '/:id',
				method: 'patch',
				handler: this.updateStoreFront.bind(this),
				middlewares: [authMiddleware, validate(storeValidation.updateStoreFront)],
			},
		];
	}

	public async createStorefront(
		req,
		res: Response,
		next: NextFunction,
	) {
		try {
			const vendorId = req.user.id;

      if(req.body.logo) {
        const logo = await uploadImageToCloudinary(req.body.logo, 'storefronts');
        req.body.logo = logo;
      }
      
			const storefront = await StorefrontService.createStorefront(vendorId, req.body);

			super.send(res, storefront, StatusCodes.CREATED);
		} catch (error) {
      console.log(error.message)
			next(error);
		}
	}

	public async getPublicStoreFront(
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		try {
			const storefronts = await StorefrontService.getStorefrontBySlug(req.params.slug);
			super.send(res, storefronts, StatusCodes.OK);
		} catch (error) {
			next(error);
		}
	}

  public async updateStoreFront(
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		try {
      const vendorId = res.locals.user.id;

			const storefronts = await StorefrontService.updateStoreFront(vendorId, req.params.id, req.body);
			super.send(res, storefronts, StatusCodes.OK);
		} catch (error) {
			next(error);
		}
	}
}
