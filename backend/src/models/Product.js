import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		description: { type: String },
		price: { type: Number, required: true },
		image: { type: String },
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Category",
			required: true,
		},
		stock: { type: Number, default: 0 },
	},
	{ timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
