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

        // Validate items structure
        for (const item of items) {
            if (!item.productId || !item.quantity || item.quantity <= 0) {
                return res.status(400).json({
                    message: "Each item must have productId and positive quantity"
                });
            }
        }

        const updateResults = [];
        const notFoundProducts = [];

        for (const item of items) {
            // Fix: Use findOne with your custom id field, not findById
            const product = await Product.findOne({ id: item.productId });

            if (!product) {
                notFoundProducts.push(item.productId);
                continue;
            }

            // Check if sufficient stock is available
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for product ${item.productId}. Available: ${product.stock}, Requested: ${item.quantity}`
                });
            }

            const newStock = product.stock - item.quantity;
            product.stock = newStock;
            product.inStock = newStock > 0;

            await product.save();

            updateResults.push({
                productId: item.productId,
                oldStock: product.stock + item.quantity,
                newStock: newStock,
                quantityDeducted: item.quantity
            });
        }

        // Prepare response
        const response = {
            success: true,
            message: "Stock updated successfully",
            updated: updateResults
        };

        if (notFoundProducts.length > 0) {
            response.warning = `Products not found: ${notFoundProducts.join(', ')}`;
        }

        res.json(response);

    } catch (error) {
        console.error("Error updating stock:", error);
        res.status(500).json({
            message: "Error updating stock",
            error: error.message
        });
    }
});

// Alternative: Bulk update approach for better performance
router.put("/bulk", async (req, res) => {
    try {
        const { items } = req.body;

        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ message: "Invalid items payload" });
        }

        // Validate items
        for (const item of items) {
            if (!item.productId || !item.quantity || item.quantity <= 0) {
                return res.status(400).json({
                    message: "Each item must have productId and positive quantity"
                });
            }
        }

        const productIds = items.map(item => item.productId);

        // Fetch all products at once
        const products = await Product.find({ id: { $in: productIds } });

        if (products.length !== items.length) {
            const foundIds = products.map(p => p.id);
            const missingIds = productIds.filter(id => !foundIds.includes(id));
            return res.status(404).json({
                message: `Products not found: ${missingIds.join(', ')}`
            });
        }

        // Check stock availability for all items
        const stockCheck = [];
        for (const item of items) {
            const product = products.find(p => p.id === item.productId);
            if (product.stock < item.quantity) {
                stockCheck.push({
                    productId: item.productId,
                    available: product.stock,
                    requested: item.quantity
                });
            }
        }

        if (stockCheck.length > 0) {
            return res.status(400).json({
                message: "Insufficient stock for some products",
                insufficientStock: stockCheck
            });
        }

        // Perform bulk updates
        const bulkOps = items.map(item => ({
            updateOne: {
                filter: { id: item.productId },
                update: {
                    $inc: { stock: -item.quantity },
                    $set: { inStock: { $gt: [{ $subtract: ["$stock", item.quantity] }, 0] } }
                }
            }
        }));

        const result = await Product.bulkWrite(bulkOps);

        res.json({
            success: true,
            message: "Stock updated successfully",
            modifiedCount: result.modifiedCount,
            matchedCount: result.matchedCount
        });

    } catch (error) {
        console.error("Error in bulk stock update:", error);
        res.status(500).json({
            message: "Error updating stock",
            error: error.message
        });
    }
});

export default router;