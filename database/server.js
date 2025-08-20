import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';

import getProducts from './api/getProducts.js';
import getProduct from './api/getProduct.js';
import updateProducts from './api/updateProducts.js';

dotenv.config();

const app = express();

// Allow Vercel frontend
app.use(cors({
    origin: ["http://localhost:3001", "https://mruarts-shop.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// -----------------------------
// WhatsApp Send Message API
// -----------------------------
app.post("/api/send-message", async (req, res) => {
    try {
        const { phone, message } = req.body;

        if (!phone || !message) {
            return res.status(400).json({ error: "Phone and message are required" });
        }

        const response = await axios.post(
            `https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                to: phone, // include country code e.g. "91XXXXXXXXXX"
                type: "text",
                text: { body: message }
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.json({ success: true, data: response.data });
    } catch (error) {
        console.error("❌ WhatsApp API Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to send WhatsApp message" });
    }
});

// -----------------------------
// Product Routes
// -----------------------------
app.use('/api/products', getProducts);
app.use('/api/product', getProduct);
app.use('/api/orders', updateProducts);

app.get("/", (req, res) => {
    res.send("🚀 Backend is running!");
});

// -----------------------------
// MongoDB connect
// -----------------------------
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
