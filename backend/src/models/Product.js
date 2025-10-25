import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		name: { type: String, required: true }, // Tên người dùng
		rating: { type: Number, required: true, min: 1, max: 5 },
		comment: { type: String, required: true },
	},
	{ timestamps: true }
);

const productSchema = new mongoose.Schema(
	{
		title: { type: String, required: true, trim: true },
		description: { type: String },
		price: { type: Number, required: true },
		image: { type: String },
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Category",
			required: true,
		},

		brand: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Brand",
			required: false,
		},
		stock: { type: Number, default: 0 },
		reviews: [reviewSchema], // Mảng các đánh giá
		rating: { type: Number, default: 0 }, // Đánh giá trung bình
		numReviews: { type: Number, default: 0 }, // Tổng số đánh giá
		sold: { type: Number, default: 0 }, // 🟢 THÊM: Trường đếm số lượt bán
	},
	{ timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
