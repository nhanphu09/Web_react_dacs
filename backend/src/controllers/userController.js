import User from "../models/User.js";

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
