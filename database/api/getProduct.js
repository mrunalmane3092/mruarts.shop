import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const { category, bias, stock } = req.query;
        let filter = {};

        // Category filter
        if (category) {
            const categoryArray = category.split(',');
            filter.category = { $in: categoryArray };
        }

        // Bias filter
        if (bias) {
            const biasArray = bias.split(',');
            filter.members = { $in: biasArray };
        }

        // Stock filter (uses your inStock boolean field)
        if (stock === 'inStock') {
            filter.inStock = true;
        } else if (stock === 'outStock') {
            filter.inStock = false;
        }

        const product = await Product.find(filter);
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
});

export default router;