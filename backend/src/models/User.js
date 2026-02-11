import crypto from "crypto";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		name: { type: String, default: "Guest" },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		role: { type: String, enum: ["user", "admin"], default: "user" },
		locked: { type: Boolean, default: false },
		wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
		resetPasswordToken: String,
		resetPasswordExpire: Date,
	},
	{ timestamps: true }
);

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	this.password = await bcrypt.hash(this.password, 10);
	next();
});

userSchema.methods.matchPassword = async function (entered) {
	return await bcrypt.compare(entered, this.password);
};

// Generate and hash password token
userSchema.methods.getResetPasswordToken = function () {
	// Generate token
	const resetToken = crypto.randomBytes(20).toString("hex");

	// Hash token and set to resetPasswordToken field
	this.resetPasswordToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");

	// Set expire
	this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

	return resetToken;
};

export default mongoose.model("User", userSchema);
