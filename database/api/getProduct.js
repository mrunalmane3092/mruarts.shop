import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const { category, bias, stock } = req.query;
        let filter = {};

        // Category filter
        if (category) {
            filter.category = { $in: category.split(',') };
        }

        // Bias filter
        if (bias) {
            filter.members = { $in: bias.split(',') };
        }

        // Stock filter
        if (stock === 'inStock') filter.inStock = true;
        if (stock === 'outStock') filter.inStock = false;

        const product = await Product.find(filter).sort({ _id: -1 });

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
});

export default router;