import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

// Gmail-safe Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Route: send order emails with HTML
router.post("/send-order-emails", async (req, res) => {
    try {
        const { customerEmail, customerName, orderSummary } = req.body;

        // HTML for customer email
        const customerHtml = `
            <div style="font-family: sans-serif; line-height: 1.6;">
                <h2>Hi ${customerName},</h2>
                <p>Thank you for your order!</p>
                <h3>Order Summary:</h3>
                <pre style="background: #f4f4f4; padding: 10px;">${orderSummary}</pre>
                <p>We will notify you once it’s shipped.</p>
                <p>- Team <strong>MRU Arts</strong></p>
            </div>
        `;

        // HTML for shop owner email
        const ownerHtml = `
            <div style="font-family: sans-serif; line-height: 1.6;">
                <h2>📦 New Order Received</h2>
                <p><strong>Customer:</strong> ${customerName}</p>
                <h3>Order Summary:</h3>
                <pre style="background: #f4f4f4; padding: 10px;">${orderSummary}</pre>
            </div>
        `;

        // Customer email options
        const customerMailOptions = {
            from: `"MRU Arts" <${process.env.EMAIL_USER}>`,
            to: customerEmail,
            subject: "Your Order Confirmation - MRU Arts",
            html: customerHtml,
        };

        // Owner email options
        const ownerMailOptions = {
            from: `"MRU Arts" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: "📦 New Order Received",
            html: ownerHtml,
        };

        // Send both emails in parallel
        await Promise.all([
            transporter.sendMail(customerMailOptions),
            transporter.sendMail(ownerMailOptions),
        ]);

        res.json({ success: true, message: "HTML emails sent successfully!" });
    } catch (error) {
        console.error("❌ Email error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
