import express from "express";
import { getChartData, getStats } from "../controllers/reportController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, adminOnly, getStats);

router.get("/charts", protect, adminOnly, getChartData);

export default router;
