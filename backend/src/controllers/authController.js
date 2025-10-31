import jwt from "jsonwebtoken";
import User from "../models/User.js";

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
		console.log("USER LẤY TỪ DATABASE:", user);
		console.log("Password check:", await user.matchPassword(password));
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
