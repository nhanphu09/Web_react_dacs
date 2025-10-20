import Category from "../models/Category.js";

export const getCategories = async (req, res) => {
	try {
		const categories = await Category.find();
		res.json(categories);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const createCategory = async (req, res) => {
	try {
		const category = new Category({ name: req.body.name });
		await category.save();
		res.status(201).json(category);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};
