import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import getProducts from './api/getProducts.js';
import getProduct from './api/getProduct.js';
import updateProducts from './api/updateProducts.js';

dotenv.config();

const app = express();

// ✅ Allow Vercel frontend
app.use(cors({
    origin: ["http://localhost:3001", "https://mruarts-shop.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// Routes
app.use('/api/products', getProducts);
app.use('/api/product', getProduct);
app.use('/api/orders', updateProducts);

app.get("/", (req, res) => {
    res.send("🚀 Backend is running!");
});

// MongoDB connect
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('✅ MongoDB Connected');
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err);
        process.exit(1);
    });
