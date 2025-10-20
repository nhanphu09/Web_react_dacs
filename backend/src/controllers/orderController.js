import Order from "../models/Order.js";

export const getOrders = async (req, res) => {
	try {
		const orders = await Order.find()
			.populate("user")
			.populate("products.product");
		res.json(orders);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const createOrder = async (req, res) => {
	try {
		const { products, totalPrice } = req.body;
		const order = new Order({
			user: req.user._id,
			products,
			totalPrice,
		});
		await order.save();
		res.status(201).json(order);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};
