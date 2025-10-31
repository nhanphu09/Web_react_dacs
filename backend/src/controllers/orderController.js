import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

export const getOrders = async (req, res) => {
	try {
		const pageSize = 10;
		const page = Number(req.query.page) || 1;

		let sortOptions = { createdAt: -1 };

		const filter = {};

		if (req.query.status) {
			filter.status = req.query.status;
		}

		if (req.query.keyword) {
			const keyword = req.query.keyword;

			const searchCriteria = [];

			if (mongoose.Types.ObjectId.isValid(keyword)) {
				searchCriteria.push({ _id: keyword });
			}

			const users = await User.find({
				name: { $regex: keyword, $options: "i" },
			}).select("_id");

			const userIds = users.map((u) => u._id);

			if (userIds.length > 0) {
				searchCriteria.push({ user: { $in: userIds } });
			}

			if (searchCriteria.length > 0) {
				filter.$or = searchCriteria;
			} else {
				filter._id = new mongoose.Types.ObjectId();
			}
		}

		const count = await Order.countDocuments(filter);

		const orders = await Order.find(filter)
			.populate("user", "name")
			.populate("products.product", "title")
			.sort(sortOptions)
			.limit(pageSize)
			.skip(pageSize * (page - 1));

		res.json({
			orders,
			page,
			totalPages: Math.ceil(count / pageSize),
		});
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const createOrder = async (req, res) => {
	try {
		const { products, totalPrice, shippingAddress, paymentMethod } = req.body;
		const order = new Order({
			user: req.user._id,
			products,
			totalPrice,
			shippingAddress,
			paymentMethod,
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

export const getOrderById = async (req, res) => {
	try {
		const order = await Order.findById(req.params.id)
			.populate("user", "name email") // Lấy chi tiết user
			.populate({
				path: "products.product", // Lấy chi tiết tất cả sản phẩm
				model: "Product",
			});

		if (order) {
			res.json(order);
		} else {
			res.status(404).json({ message: "Order not found" });
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
