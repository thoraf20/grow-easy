import mongoose, { Schema } from 'mongoose';

const StorefrontSchema = new Schema(
	{
		vendorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		name: { type: String, required: true, unique: true },
		bio: { type: String, required: true, maxLength: 500 },
		logo: { type: String },
		products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
		slug: { type: String, required: true, unique: true },
		createdAt: { type: Date, default: Date.now },
	},
);

export default mongoose.model('Storefront', StorefrontSchema);
