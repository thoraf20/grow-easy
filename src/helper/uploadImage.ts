import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config';

cloudinary.config({
	cloud_name: config.cloudinary.cloudName,
	api_key: config.cloudinary.apiKey,
	api_secret: config.cloudinary.apiSecret,
});

export const uploadImageToCloudinary = async (filePath: string, folder = 'grow-easy'): Promise<{ url: string; public_id: string }> => {
	try {
		const result = await cloudinary.uploader.upload(filePath, {
			folder,
			resource_type: 'image',
		});
		return { url: result.secure_url, public_id: result.public_id };
	} catch (error) {
		throw new Error('Cloudinary upload failed: ' + error.message);
	}
};
