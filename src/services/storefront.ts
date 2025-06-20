import Storefront from '../models/store';
import ApiError from '../abstractions/ApiError';
import { StatusCodes } from 'http-status-codes';
import { slugify } from '../utils';

interface CreateStorefrontDTO {
	name: string;
	bio: string;
	logo?: string;
}

export const StorefrontService = {
	async createStorefront(vendorId: string, data: CreateStorefrontDTO) {
		const slug = slugify(data.name);
		
		const exists = await Storefront.findOne({
			$or: [{ slug }, { name: data.name }],
		});

		if (exists) {
			throw new ApiError(
				'Storefront name or URL already exists',
				StatusCodes.CONFLICT,
			);
		}

		const storefront = new Storefront({ ...data, vendorId, slug });
		await storefront.save();
		return storefront;
	},

	async getStorefrontById(id: string) {
		const storefront = await Storefront.findById(id).populate('vendorId', 'email');
		if (!storefront) {
			throw new ApiError('Storefront not found', StatusCodes.NOT_FOUND);
		}
		return storefront;
	},

	async getStorefrontBySlug(slug: string) {
		const storefront = await Storefront.findOne({ slug }).populate('products');
		if (!storefront) {
			throw new ApiError('Storefront not found', StatusCodes.NOT_FOUND);
		}
		return storefront;
	},

	async updateStoreFront(vendorId: string, storefrontId: string, data: Partial<CreateStorefrontDTO>) {
		const storefront = await Storefront.findById(storefrontId);
		if (!storefront) {
			throw new ApiError('Storefront not found', StatusCodes.NOT_FOUND);
		}
		if (storefront.vendorId.toString() !== vendorId) {
			throw new ApiError('Unauthorized to update this storefront', StatusCodes.UNAUTHORIZED);
		}

		const slug = slugify(data.name || data.name);
		const exists = await Storefront.findOne({
			$or: [{ slug }, { name: data.name }],
		});

		if (exists && exists._id.toString() !== storefrontId) {
			throw new ApiError(
				'Storefront name or URL already exists',
				StatusCodes.CONFLICT,
			);
		}

		Object.assign(storefront, data, { slug });
		await storefront.save();
		return storefront;
	},
};
