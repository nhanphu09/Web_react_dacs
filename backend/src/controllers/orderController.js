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
		for (const item of order.products) {
			await Product.updateOne(
				{ _id: item.product },
				{
					$inc: {
						stock: -item.quantity, // Trừ kho
						sold: +item.quantity, // Tăng lượt bán
					},
				}
			);
		}
		res.status(201).json(order);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

export const getMyOrders = async (req, res) => {
	try {
		const orders = await Order.find({ user: req.user._id })
			.populate("user")
			.populate("products.product");
		res.json(orders);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const updateOrderStatus = async (req, res) => {
	try {
		const order = await Order.findById(req.params.id);
		if (order) {
			order.status = req.body.status || order.status;
			const updatedOrder = await order.save();
			res.json(updatedOrder);
		} else {
			res.status(404).json({ message: "Order not found" });
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
