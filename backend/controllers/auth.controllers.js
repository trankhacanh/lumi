import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import sendMail from "../config/Mail.js";
export const signUp = async (req, res) => {
    try {
        const { name, email, password, username } = req.body
        const findByEmail = await User.findOne({ email });
        if (findByEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const findByUserName = await User.findOne({ username });
        if (findByUserName) {
            return res.status(400).json({ message: "Username already exists" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ name, username, email, password: hashedPassword });

        const token = await genToken(user._id);

        res.cookie("token", token, { httpOnly: true, maxAge: 10 * 365 * 24 * 60 * 60 * 1000, secure: true, sameSite: "none" });
        return res.status(201).json({ message: "User created successfully", user, token });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const signIn = async (req, res) => {
    try {
        const { username, password } = req.body;

        // tìm user theo username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        // so sánh password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        // tạo token
        const token = await genToken(user._id);

        // lưu cookie
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 10 * 365 * 24 * 60 * 60 * 1000,
          secure: true, sameSite: "none"
        });

        return res.status(200).json({
            message: "Login successful",
            user,
            token,
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const signOut = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: "Sign out successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const sendOtp = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Email không tồn tại" });

        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        // Gửi email
        await sendMail(email, otp);

        // Lưu OTP vào đúng field trong model
        user.resetOtp = otp;
        user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 phút
        user.isOtpVerified = false;
        await user.save();

        res.json({ message: "OTP đã được gửi đến email của bạn" });
    } catch (error) {
        console.error("Lỗi khi gửi OTP:", error.message);
        res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
};


export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: "Không tìm thấy người dùng" });
        if (!user.resetOtp) return res.status(400).json({ message: "Chưa gửi OTP" });
        if (user.resetOtp !== otp) return res.status(400).json({ message: "OTP không chính xác" });
        if (user.otpExpires < Date.now()) return res.status(400).json({ message: "OTP đã hết hạn" });

        user.isOtpVerified = true;
        user.resetOtp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Xác minh OTP thành công!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !user.isOtpVerified) {
            return res.status(400).json({ message: "otp verfication required" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.isOtpVerified = false;
        await user.save();
        return res.status(200).json({ message: "Password reset successfully" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
