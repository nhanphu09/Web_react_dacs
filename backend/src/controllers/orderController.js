import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

// --- 1. Lấy danh sách đơn hàng (Admin - Có lọc & phân trang) ---
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
				filter._id = new mongoose.Types.ObjectId(); // Không tìm thấy thì trả về rỗng
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

// --- 2. Tạo đơn hàng mới (Có trừ kho) ---
export const createOrder = async (req, res) => {
	try {
		const { products, totalPrice, shippingAddress, paymentMethod } = req.body;

		if (!products || products.length === 0) {
			return res.status(400).json({ message: "Không có sản phẩm nào trong giỏ hàng" });
		}

		const order = new Order({
			user: req.user._id,
			products,
			totalPrice,
			shippingAddress,
			paymentMethod,
		});

		const createdOrder = await order.save();

		// Trừ tồn kho & Tăng lượt bán
		for (const item of createdOrder.products) {
			await Product.updateOne(
				{ _id: item.product },
				{
					$inc: {
						stock: -item.quantity,
						sold: +item.quantity,
					},
				}
			);
		}
		res.status(201).json(createdOrder);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

// --- 3. Lấy đơn hàng của tôi (User) ---
export const getMyOrders = async (req, res) => {
	try {
		// Chỉ lấy đơn của chính user đang đăng nhập
		const orders = await Order.find({ user: req.user._id })
			.populate("user", "name email")
			.populate("products.product")
			.sort({ createdAt: -1 }); // Mới nhất lên đầu

		res.json(orders);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// --- 4. Cập nhật trạng thái đơn (Admin) ---
export const updateOrderStatus = async (req, res) => {
	try {
		const order = await Order.findById(req.params.id);
		if (order) {
			order.status = req.body.status || order.status;

			// Nếu đơn hàng chuyển sang trạng thái "Delivered", cập nhật thời gian thanh toán
			if (order.status === "Delivered") {
				order.isPaid = true;
				order.paidAt = Date.now();
				order.isDelivered = true;
				order.deliveredAt = Date.now();
			}

			const updatedOrder = await order.save();
			res.json(updatedOrder);
		} else {
			res.status(404).json({ message: "Order not found" });
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// --- 5. Lấy chi tiết đơn hàng (User & Admin) ---
// 🔥 ĐÃ NÂNG CẤP BẢO MẬT
export const getOrderById = async (req, res) => {
	try {
		const order = await Order.findById(req.params.id)
			.populate("user", "name email")
			.populate("products.product");

		if (!order) {
			return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
		}

		// 🔒 BẢO MẬT: Kiểm tra xem người xem có phải là chủ đơn hàng hoặc Admin không
		// req.user._id lấy từ middleware protect
		if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
			return res.status(403).json({ message: "Bạn không có quyền xem đơn hàng này" });
		}

		res.json(order);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};