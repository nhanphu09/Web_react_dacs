import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
	try {
		// 🟢 NÂNG CẤP: Logic Phân trang
		const page = Number(req.query.page) || 1; // Trang hiện tại, mặc định là 1
		const pageSize = Number(req.query.limit) || 8; // Số SP mỗi trang, mặc định 8

		const filter = {}; // Bộ lọc (giữ nguyên)
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

		let sortOptions = { createdAt: -1 }; // Mặc định: Mới nhất
		if (req.query.sort === "price_asc") {
			sortOptions = { price: 1 }; // 1 = tăng dần
		} else if (req.query.sort === "price_desc") {
			sortOptions = { price: -1 }; // -1 = giảm dần
		} else if (req.query.sort === "sort_dects") {
			sortOptions = { sold: -1 };
		}

		// Đếm tổng số sản phẩm khớp với bộ lọc
		const count = await Product.countDocuments(filter);

		const products = await Product.find(filter)
			.populate("category")
			.populate("brand")
			.sort(sortOptions)
			.limit(pageSize) // 🟢 SỬA: Dùng pageSize
			.skip(pageSize * (page - 1)); // 🟢 THÊM: Bỏ qua các SP của trang trước

		// 🟢 SỬA: Trả về cả sản phẩm và thông tin phân trang
		res.json({
			products,
			page,
			totalPages: Math.ceil(count / pageSize),
		});
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const createProduct = async (req, res) => {
	try {
		const { title, description, price, category, stock, brand, image } =
			req.body;
		const product = new Product({
			title,
			description,
			price,
			category,
			stock,
			brand,
			image,
		});
		await product.save();
		res.status(201).json(product);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

export const getProductById = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id).populate("category");
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
			res.json(product.reviews || []); // Trả về mảng reviews
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
			await product.deleteOne(); // Sử dụng deleteOne() trên document
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
			// Kiểm tra xem người dùng đã đánh giá chưa
			const alreadyReviewed = product.reviews.find(
				(r) => r.user.toString() === req.user._id.toString()
			);

			if (alreadyReviewed) {
				return res
					.status(400)
					.json({ message: "Bạn đã đánh giá sản phẩm này" });
			}

			// Tạo đánh giá mới
			const review = {
				name: req.user.name,
				rating: Number(rating),
				comment,
				user: req.user._id,
			};

			product.reviews.push(review);

			// Cập nhật số lượng và điểm trung bình
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
