import Brand from "../models/Brand.js";

export const getBrands = async (req, res) => {
	try {
		const brands = await Brand.find().sort({ name: 1 }); // Sắp xếp theo tên
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

export const updateBrand = async (req, res) => {
	try {
		const brand = await Brand.findById(req.params.id);
		if (brand) {
			brand.name = req.body.name || brand.name;
			await brand.save();
			res.json(brand);
		} else {
			res.status(404).json({ message: "Brand not found" });
		}
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

export const deleteBrand = async (req, res) => {
	try {
		const brand = await Brand.findById(req.params.id);
		if (brand) {
			await brand.deleteOne();
			res.json({ message: "Brand removed" });
		} else {
			res.status(404).json({ message: "Brand not found" });
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
