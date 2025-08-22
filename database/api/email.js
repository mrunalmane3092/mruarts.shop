import express from "express";
import transporter from "../config/email.js";


const router = express.Router();

// Route: send order emails with HTML
router.post("/send-order-emails", async (req, res) => {
    try {
        console.log("EMAIL_USER in route:", process.env.EMAIL_USER);
        console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);

        const { customerEmail, customerName, orderSummary } = req.body;

        // HTML for customer email
        const customerHtml = `
  <div style="font-family:'Fugaz One',sans-serif !important;background:#fdfdfd;padding:20px;color:#333;">
    <div style="max-width:600px;margin:auto;border-radius:12px;overflow:hidden;
                box-shadow:0 4px 12px rgba(0,0,0,0.08);border:1px solid #eee;">
      
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#8b5cf6,#ec4899);
                  padding:20px;text-align:center;color:white;font-family:'Fugaz One',sans-serif !important;">
        <h2 style="margin:0;font-size:24px;">🤍 Thank You for Your Order!</h2>
      </div>
      
      <!-- Body -->
      <div style="padding:20px;">
        <p style="font-size:16px;margin:0 0 10px;">Hi <strong>${customerName}</strong>,</p>
        <p style="font-size:15px;">I'm so happy you chose <strong>mruarts.shop</strong> 🎁<br>
        📝 Here’s a summary of your order:</p>

        <div style="background:#faf5ff;padding:15px;border-radius:8px;
                    border:1px solid #e9d5ff;font-family:monospace;
                    font-size:14px;line-height:1.6;">
          ${orderSummary.replace(/\n/g, "<br>")}
        </div>

        <p style="margin-top:20px;">✨ We’ll notify you once it’s shipped.<br>
        Until then, thank you for supporting my small shop 💜</p>
      </div>

      <!-- Footer -->
      <div style="background:#f9fafb;padding:15px;text-align:center;
                  font-size:13px;color:#666;">APOBANGPO,<br><strong style="font-family:'Fugaz One',sans-serif !important;">💜 BORAHAE 💜</strong><br>
        <a href="https://mruarts-shop.vercel.app" 
           style="color:#8b5cf6;text-decoration:none;">Visit mruarts.shop</a>
      </div>
    </div>
  </div>
`;



        // HTML for shop owner email
        const ownerHtml = `
  <div style="font-family:'Fugaz One',sans-serif !important;background:#fdfdfd;padding:20px;color:#333;">
    <div style="max-width:600px;margin:auto;border-radius:12px;overflow:hidden;
                box-shadow:0 4px 12px rgba(0,0,0,0.08);border:1px solid #eee;">
      
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#8b5cf6,#ec4899);
                  padding:20px;text-align:center;color:white;font-family:'Fugaz One',sans-serif !important;">
        <h2 style="margin:0;font-size:24px;">📦 New Order Received</h2>
      </div>
      
      <!-- Body -->
      <div style="padding:20px;">
        <p style="font-size:15px;margin:0 0 10px;">
          <strong>Customer:</strong> ${customerName}
        </p>
        <h3 style="margin:20px 0 10px;font-size:18px;">📝 Order Summary:</h3>
        <div style="background:#faf5ff;padding:15px;border-radius:8px;
                    border:1px solid #e9d5ff;font-family:monospace;
                    font-size:14px;line-height:1.6;">
          ${orderSummary.replace(/\n/g, "<br>")}
        </div>
      </div>

      <!-- Footer -->
      <div style="background:#f9fafb;padding:15px;text-align:center;
                  font-size:13px;color:#666;font-family:'Fugaz One',sans-serif !important;">

      </div>
    </div>
  </div>
`;

        // Customer email options
        const customerMailOptions = {
            from: `"mruarts.shop" <${process.env.EMAIL_USER}>`,
            to: customerEmail,
            subject: "Your Order Confirmation - mruarts.shop",
            html: customerHtml,
        };

        // Owner email options
        const ownerMailOptions = {
            from: `"mruarts.shop" <${process.env.EMAIL_USER}>`,
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
