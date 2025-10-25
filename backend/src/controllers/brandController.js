import Brand from "../models/Brand.js";

export const getBrands = async (req, res) => {
	try {
		const brands = await Brand.find();
		res.json(brands);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const createBrand = async (req, res) => {
	try {
		const brand = new Brand({ name: req.body.name });
		await brand.save();
		res.status(201).json(brand);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};
