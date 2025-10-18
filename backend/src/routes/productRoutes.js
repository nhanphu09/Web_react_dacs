import express from "express";
const router = express.Router();
router.get("/", (req,res)=>{
  res.json([
    { id: 1, name: "Sneaker One", price: 59.99, description: "Comfortable sneaker." },
    { id: 2, name: "Runner Pro", price: 89.99, description: "Lightweight runner." },
    { id: 3, name: "Classic Leather", price: 129.99, description: "Premium leather shoe." }
  ]);
});
router.get("/:id", (req,res)=>{ res.json({ id: req.params.id, name: `Product ${req.params.id}`, price: 49.99 }); });
export default router;
