import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

const genToken = (user) =>
	jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
		expiresIn: "7d",
	});

export const register = async (req, res) => {
	try {
		const { name, email, password } = req.body;
		if (!email || !password)
			return res.status(400).json({ message: "Email and password required" });
		const exists = await User.findOne({ email });
		if (exists)
			return res.status(400).json({ message: "Email already exists" });
		const user = await User.create({ name, email, password });

		res.status(201).json({
			token: genToken(user),
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
				isAdmin: user.isAdmin,
			},
		});
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		// console.log("User login attempt:", user.email);
		// console.log("Password check:", await user.matchPassword(password));
		if (!user || !(await user.matchPassword(password)))
			return res.status(401).json({ message: "Invalid credentials" });
		if (user.locked) return res.status(403).json({ message: "Account locked" });

		res.json({
			token: genToken(user),
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
				isAdmin: user.isAdmin,
			},
		});
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// @desc    Forgot Password
// @route   POST /api/auth/forgotpassword
// @access  Public
export const forgotPassword = async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Get reset token
		const resetToken = user.getResetPasswordToken();

		await user.save({ validateBeforeSave: false });

		// Create reset url
		const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

		const message = `
      <h1>You have requested a password reset</h1>
      <p>Please go to this link to reset your password:</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;

		try {
			await sendEmail({
				email: user.email,
				subject: "Password Reset Request",
				message,
			});

			res.status(200).json({ success: true, data: "Email sent" });
		} catch (err) {
			console.log(err);
			user.resetPasswordToken = undefined;
			user.resetPasswordExpire = undefined;

			await user.save({ validateBeforeSave: false });

			return res.status(500).json({ message: "Email could not be sent" });
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// @desc    Reset Password
// @route   PUT /api/auth/resetpassword/:resetToken
// @access  Public
export const resetPassword = async (req, res) => {
	try {
		// Get hashed token
		const resetPasswordToken = crypto
			.createHash("sha256")
			.update(req.params.resetToken)
			.digest("hex");

		const user = await User.findOne({
			resetPasswordToken,
			resetPasswordExpire: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ message: "Invalid token" });
		}

		// Set new password
		user.password = req.body.password;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;

		await user.save();

		res.status(201).json({
			success: true,
			token: genToken(user),
			message: "Password updated successfully",
		});
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
