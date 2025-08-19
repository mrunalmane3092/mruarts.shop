import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// Update stock after order
router.put("/", async (req, res) => {
    try {
        const { items } = req.body;

        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ message: "Invalid items payload" });
        }

        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) continue;

            const newStock = product.stock - item.quantity;
            product.stock = Math.max(newStock, 0);
            product.inStock = newStock > 0; // set false if stock 0

            await product.save();
        }

        res.json({ success: true, message: "Stock updated successfully" });
    } catch (error) {
        console.error("Error updating stock:", error);
        res.status(500).json({ message: "Error updating stock", error });
    }
});

export default router;
