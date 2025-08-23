import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import nodemailer from 'nodemailer';
import cron from 'node-cron';

import getProducts from './api/getProducts.js';
import getProduct from './api/getProduct.js';
import updateProducts from './api/updateProducts.js';
import emailRoute from "./api/email.js";

const app = express();

// -----------------------------
// MongoDB Visit Schema
// -----------------------------
const visitSchema = new mongoose.Schema({
    date: { type: String, required: true }, // YYYY-MM-DD
    count: { type: Number, default: 0 }
});

const Visit = mongoose.model('Visit', visitSchema);

// -----------------------------
// Middleware to track visits
// -----------------------------
app.use(async (req, res, next) => {
    try {
        const today = new Date().toISOString().slice(0, 10);
        const record = await Visit.findOne({ date: today });

        if (record) {
            record.count += 1;
            await record.save();
        } else {
            await Visit.create({ date: today, count: 1 });
        }
    } catch (err) {
        console.error("❌ Error tracking visit:", err);
    }
    next();
});

// -----------------------------
// Allow Vercel frontend
// -----------------------------
app.use(cors({
    origin: ["http://localhost:3001", "https://mruarts-shop.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// -----------------------------
// Product Routes
// -----------------------------
app.use('/api/products', getProducts);
app.use('/api/product', getProduct);
app.use('/api/orders', updateProducts);
app.use("/api/email", emailRoute);

app.get("/", (req, res) => {
    res.send("🚀 Backend is running!");
});

// -----------------------------
// Nodemailer setup
// -----------------------------
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,       // your email
        pass: process.env.EMAIL_PASS        // app password if 2FA enabled
    }
});

// -----------------------------
// Cron job: Send daily visits email at 11:59 PM
// -----------------------------
cron.schedule("59 23 * * *", async () => {
    try {
        const today = new Date().toISOString().slice(0, 10);
        const record = await Visit.findOne({ date: today });
        const count = record ? record.count : 0;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: `Daily Site Visits - ${today}`,
            text: `Your site had ${count} visits today.`
        };

        await transporter.sendMail(mailOptions);
        console.log("✅ Daily visit email sent");
    } catch (err) {
        console.error("❌ Error sending daily visit email:", err);
    }
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
