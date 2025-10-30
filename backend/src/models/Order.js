// backend/models/Order.js
import mongoose from "mongoose";

// 🟢 THÊM SCHEMA PHỤ CHO ĐỊA CHỈ
const shippingAddressSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true },
	phone: { type: String, required: true },
	line1: { type: String, required: true },
	city: { type: String, required: true },
	postal: { type: String },
});

const orderSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		products: [
			{
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
				},
				quantity: { type: Number, required: true, default: 1 },
			},
		],
		totalPrice: { type: Number, required: true },
		status: {
			type: String,
			enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
			default: "Pending",
		},
		// 🟢 THÊM 2 DÒNG NÀY
		shippingAddress: { type: shippingAddressSchema, required: true },
		paymentMethod: { type: String, required: true, default: "COD" },
	},
	{ timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
