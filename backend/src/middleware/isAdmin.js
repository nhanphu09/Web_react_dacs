export const isAdmin = (req, res, next) => {
	try {
		if (req.user && req.user.isAdmin) {
			next();
		} else {
			return res.status(403).json({ message: "Access denied. Admin only." });
		}
	} catch (error) {
		res.status(500).json({ message: "Admin check failed", error });
	}
};
