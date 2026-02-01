import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
    {
        code: { type: String, required: true, unique: true, uppercase: true, trim: true },
        discount: { type: Number, required: true }, // Số phần trăm giảm (VD: 10 là 10%)
        expirationDate: { type: Date, required: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.model("Coupon", couponSchema);