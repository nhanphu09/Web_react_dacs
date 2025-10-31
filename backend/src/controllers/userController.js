import User from "../models/User.js";

export const getUsers = async (req, res) => {
	try {
		const pageSize = 10;
		const page = Number(req.query.page) || 1;

		const filter = {};

		if (req.query.keyword) {
			const keyword = req.query.keyword;
			filter.$or = [
				{ name: { $regex: keyword, $options: "i" } },
				{ email: { $regex: keyword, $options: "i" } },
			];
		}

		const count = await User.countDocuments(filter);
		const users = await User.find(filter)
			.select("-password")
			.limit(pageSize)
			.skip(pageSize * (page - 1));

		res.json({
			users,
			page,
			totalPages: Math.ceil(count / pageSize),
		});
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const updateUserProfile = async (req, res) => {
	try {
		const user = await User.findById(req.user._id);

		if (user) {
			user.name = req.body.name || user.name;
			user.email = req.body.email || user.email;

			if (req.body.password) {
				user.password = req.body.password;
			}

			const updatedUser = await user.save();

			res.json({
				_id: updatedUser._id,
				name: updatedUser.name,
				email: updatedUser.email,
				role: updatedUser.role,
				isAdmin: updatedUser.role === "admin",
				token: req.headers.authorization.split(" ")[1],
			});
		} else {
			res.status(404).json({ message: "User not found" });
		}
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};
