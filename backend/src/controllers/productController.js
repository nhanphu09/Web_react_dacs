import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
	try {
		const page = Number(req.query.page) || 1;
		const pageSize = Number(req.query.limit) || 8;

		const filter = {};
		if (req.query.keyword) {
			filter.title = { $regex: req.query.keyword, $options: "i" };
		}
		if (req.query.category) {
			filter.category = req.query.category;
		}
		if (req.query.brand) {
			filter.brand = req.query.brand;
		}
		if (req.query.minPrice || req.query.maxPrice) {
			filter.price = {};
			if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
			if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
		}
		if (req.query.exclude) {
			filter._id = { $ne: req.query.exclude };
		}

		let sortOptions = { createdAt: -1 };
		if (req.query.sort === "price_asc") {
			sortOptions = { price: 1 };
		} else if (req.query.sort === "price_desc") {
			sortOptions = { price: -1 };
		} else if (req.query.sort === "sort_dects") {
			sortOptions = { sold: -1 };
		}

		const count = await Product.countDocuments(filter);

		const products = await Product.find(filter)
			.populate("category")
			.populate("brand")
			.sort(sortOptions)
			.limit(pageSize)
			.skip(pageSize * (page - 1));

		res.json({
			products,
			page,
			totalPages: Math.ceil(count / pageSize),
			count: count,
		});
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const createProduct = async (req, res) => {
	try {
		const {
			title,
			description,
			price,
			category,
			stock,
			brand,
			image,
			specs,
			promotions,
		} = req.body;
		const product = new Product({
			title,
			description,
			price,
			category,
			stock,
			brand,
			image,
			specs,
			promotions,
		});
		await product.save();
		res.status(201).json(product);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

export const updateProduct = async (req, res) => {
	try {
		const {
			title,
			description,
			price,
			category,
			stock,
			brand,
			image,
			specs,
			promotions,
		} = req.body;

		const product = await Product.findById(req.params.id);

		if (product) {
			product.title = title || product.title;
			product.description = description || product.description;
			product.price = price || product.price;
			product.category = category || product.category;
			product.stock = stock !== undefined ? stock : product.stock;
			product.brand = brand || product.brand;
			product.image = image || product.image;
			product.specs = specs || product.specs;
			product.promotions = promotions || product.promotions;

			const updatedProduct = await product.save();
			res.json(updatedProduct);
		} else {
			res.status(404).json({ message: "Product not found" });
		}
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

export const getProductById = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id)
			.populate("category")
			.populate("brand");
		if (product) {
			res.json(product);
		} else {
			res.status(404).json({ message: "Product not found" });
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const getProductReviews = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (product) {
			res.json(product.reviews || []);
		} else {
			res.status(404).json({ message: "Product not found" });
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const deleteProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		if (product) {
			await product.deleteOne();
			res.json({ message: "Product removed" });
		} else {
			res.status(404).json({ message: "Product not found" });
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const createProductReview = async (req, res) => {
	const { rating, comment } = req.body;

	try {
		const product = await Product.findById(req.params.id);

		if (product) {
			const alreadyReviewed = product.reviews.find(
				(r) => r.user.toString() === req.user._id.toString()
			);

			if (alreadyReviewed) {
				return res
					.status(400)
					.json({ message: "Bạn đã đánh giá sản phẩm này" });
			}

			const review = {
				name: req.user.name,
				rating: Number(rating),
				comment,
				user: req.user._id,
			};

			product.reviews.push(review);

			product.numReviews = product.reviews.length;
			product.rating =
				product.reviews.reduce((acc, item) => item.rating + acc, 0) /
				product.reviews.length;

			await product.save();
			res.status(201).json({ message: "Review added successfully" });
		} else {
			res.status(404).json({ message: "Product not found" });
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
