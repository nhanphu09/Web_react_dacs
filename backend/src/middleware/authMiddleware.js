import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) return res.status(401).json({ message: "No token" });
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") return res.status(403).json({ message: "Admin required" });
  next();
};