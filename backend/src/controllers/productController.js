import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
	try {
		const products = await Product.find().populate("category");
		res.json(products);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const createProduct = async (req, res) => {
	try {
		const { name, description, price, category, stock } = req.body;
		const product = new Product({ name, description, price, category, stock });
		await product.save();
		res.status(201).json(product);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};
