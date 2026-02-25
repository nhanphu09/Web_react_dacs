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

export const getWishlist = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).populate("wishlist");
		res.json(user.wishlist);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const addToWishlist = async (req, res) => {
	try {
		const { productId } = req.body;
		const user = await User.findById(req.user._id);

		if (user.wishlist.includes(productId)) {
			return res.status(400).json({ message: "Product already in wishlist" });
		}

		user.wishlist.push(productId);
		await user.save();
		res.json({ message: "Product added to wishlist" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const removeFromWishlist = async (req, res) => {
	try {
		const user = await User.findById(req.user._id);
		user.wishlist = user.wishlist.filter(
			(id) => id.toString() !== req.params.id
		);
		await user.save();
		res.json({ message: "Product removed from wishlist" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const getUserAddresses = async (req, res) => {
	try {
		const user = await User.findById(req.user._id);
		if (user) {
			res.json(user.addresses || []);
		} else {
			res.status(404).json({ message: "Không tìm thấy User" });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const addUserAddress = async (req, res) => {
	try {
		const user = await User.findById(req.user._id);
		if (user) {
			const newAddress = req.body;

			if (newAddress.isDefault) {
				user.addresses.forEach(addr => addr.isDefault = false);
			}
			else if (user.addresses.length === 0) {
				newAddress.isDefault = true;
			}

			user.addresses.push(newAddress);
			await user.save();

			res.status(201).json(user.addresses);
		} else {
			res.status(404).json({ message: "Không tìm thấy User" });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
