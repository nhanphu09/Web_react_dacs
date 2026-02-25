import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { sendOrderEmail } from "../utils/sendEmail.js";

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

// --- 2. Tạo đơn hàng mới (ĐÃ THÊM CHECK TỒN KHO) ---
export const createOrder = async (req, res) => {
	try {
		const { products, totalPrice, shippingAddress, paymentMethod } = req.body;

		if (!products || products.length === 0) {
			return res.status(400).json({ message: "Không có sản phẩm nào trong giỏ hàng" });
		}

		// ==========================================
		// 🛑 BƯỚC 1: KIỂM TRA TỒN KHO TRƯỚC KHI TẠO ĐƠN
		// ==========================================
		for (const item of products) {
			const productDB = await Product.findById(item.product);

			if (!productDB) {
				return res.status(404).json({ message: `Không tìm thấy sản phẩm.` });
			}

			// Nếu số lượng khách đặt LỚN HƠN số lượng trong kho -> Chặn lại ngay!
			if (item.quantity > productDB.stock) {
				return res.status(400).json({
					message: `Sản phẩm "${productDB.title}" chỉ còn ${productDB.stock} cái trong kho. Vui lòng giảm số lượng!`
				});
			}
		}
		// ==========================================

		// BƯỚC 2: TẠO ĐƠN HÀNG (Nếu qua được bước kiểm tra ở trên)
		const order = new Order({
			user: req.user._id,
			products,
			totalPrice,
			shippingAddress,
			paymentMethod,
		});

		const createdOrder = await order.save();

		// BƯỚC 3: TRỪ TỒN KHO & TĂNG LƯỢT BÁN
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

		// BƯỚC 4: GỬI EMAIL NGẦM (Fire and Forget)
		const emailTo = shippingAddress.email || req.user.email;

		Order.findById(createdOrder._id).populate("products.product")
			.then(populatedOrder => {
				return sendOrderEmail(emailTo, populatedOrder);
			})
			.catch(err => console.error("❌ Gửi email thất bại:", err.message));

		// TRẢ VỀ KẾT QUẢ THÀNH CÔNG
		res.status(201).json(createdOrder);

	} catch (err) {
		console.error("Lỗi tạo đơn hàng:", err);
		res.status(500).json({ message: err.message });
	}
};

// --- 3. Lấy đơn hàng của tôi (User) ---
export const getMyOrders = async (req, res) => {
	try {
		const orders = await Order.find({ user: req.user._id })
			.populate("user", "name email")
			.populate("products.product")
			.sort({ createdAt: -1 });

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
export const getOrderById = async (req, res) => {
	try {
		const order = await Order.findById(req.params.id)
			.populate("user", "name email")
			.populate("products.product");

		if (!order) {
			return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
		}

		if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
			return res.status(403).json({ message: "Bạn không có quyền xem đơn hàng này" });
		}

		res.json(order);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};