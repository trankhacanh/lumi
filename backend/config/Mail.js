import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "Gmail",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
    },
});

const sendMail = async (to, otp) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL,
            to,
            subject: "Reset Your Password",
            html: `<h3>Your OTP code is:</h3><b>${otp}</b>`,
        });
        console.log("✅ Email sent to:", to);
    } catch (error) {
        console.error("❌ Lỗi khi gửi email:", error.message);
        throw error; // để controller bắt lỗi và trả ra 500
    }
}
export default sendMail;