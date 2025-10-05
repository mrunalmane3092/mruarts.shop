import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// GET all products in reverse order (newest first)
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().sort({ _id: -1 }); // sort descending
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

export default router;
