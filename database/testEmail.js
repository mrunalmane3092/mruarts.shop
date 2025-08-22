import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

async function main() {
    try {
        const info = await transporter.sendMail({
            from: `"Test" <${process.env.EMAIL_USER}>`,
            to: "test@gmail.com",
            subject: "Test Email",
            text: "Hello from test script",
        });

        console.log("✅ Sent:", info.response);
    } catch (err) {
        console.error("❌ Error:", err);
    }
}

main();
