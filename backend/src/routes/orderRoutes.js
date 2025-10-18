import express from "express";
const router = express.Router();
router.post("/", (req,res)=>{ const order = req.body; res.status(201).json({ message: "Order created", order }); });
export default router;
