import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Storefront", required: true },
  name: { type: String, required: true, minLength: 3 },
  description: { type: String, required: true, maxLength: 500 },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, required: true },
  inStock: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now },
})

const Product = mongoose.model("Product", productSchema);
export default Product;