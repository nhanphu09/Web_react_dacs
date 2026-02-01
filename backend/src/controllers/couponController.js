import Coupon from "../models/Coupon.js";

// 1. Lấy danh sách mã (Admin)
export const getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.json(coupons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Tạo mã mới (Admin)
export const createCoupon = async (req, res) => {
    try {
        const { code, discount, expirationDate } = req.body;
        const exists = await Coupon.findOne({ code: code.toUpperCase() });
        if (exists) return res.status(400).json({ message: "Mã này đã tồn tại!" });

        const coupon = await Coupon.create({
            code: code.toUpperCase(),
            discount,
            expirationDate,
        });
        res.status(201).json(coupon);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 3. Xóa mã (Admin)
export const deleteCoupon = async (req, res) => {
    try {
        await Coupon.findByIdAndDelete(req.params.id);
        res.json({ message: "Đã xóa mã giảm giá" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 4. Khách hàng kiểm tra mã (User)
export const validateCoupon = async (req, res) => {
    try {
        const { code } = req.body;
        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        if (!coupon) {
            return res.status(404).json({ message: "Mã giảm giá không tồn tại." });
        }
        if (!coupon.isActive) {
            return res.status(400).json({ message: "Mã này đang bị khóa." });
        }
        if (new Date(coupon.expirationDate) < new Date()) {
            return res.status(400).json({ message: "Mã này đã hết hạn." });
        }

        res.json({
            code: coupon.code,
            discount: coupon.discount, // Trả về số % giảm
            message: "Áp dụng mã thành công!",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};