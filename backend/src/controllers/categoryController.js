import Category from "../models/Category.js";

export const getCategories = async (req, res) => {
	try {
		const categories = await Category.find().sort({ name: 1 }); // Sắp xếp theo tên
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

export const updateCategory = async (req, res) => {
	try {
		const category = await Category.findById(req.params.id);
		if (category) {
			category.name = req.body.name || category.name;
			await category.save();
			res.json(category);
		} else {
			res.status(404).json({ message: "Category not found" });
		}
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

export const deleteCategory = async (req, res) => {
	try {
		const category = await Category.findById(req.params.id);
		if (category) {
			await category.deleteOne();
			res.json({ message: "Category removed" });
		} else {
			res.status(404).json({ message: "Category not found" });
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
