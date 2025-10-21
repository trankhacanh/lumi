
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { severUrl } from "../App.jsx";
import LiquidEther from "../components/magicui/LiquidEther.jsx";

function ForgotPassword() {
    const [step, setStep] = useState(1); // 1: nhập email, 2: nhập OTP, 3: đổi mật khẩu
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // === Step 1: Gửi OTP ===
    const handleSendOTP = async () => {
        if (!email.trim()) return alert("Vui lòng nhập email");
        setLoading(true);
        try {
            const res = await axios.post(`${severUrl}/api/auth/sendOtp`, { email });
            alert(res.data.message || "Đã gửi OTP đến email của bạn");
            setStep(2);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Không thể gửi OTP. Vui lòng kiểm tra lại email.");
        } finally {
            setLoading(false);
        }
    };

    // === Step 2: Xác minh OTP ===
    const handleVerifyOTP = async () => {
        if (!otp.trim()) return alert("Vui lòng nhập mã OTP");
        setLoading(true);
        try {
            const res = await axios.post(`${severUrl}/api/auth/verifyOtp`, {
                email,
                otp,
            });
            alert(res.data.message || "Xác minh OTP thành công!");
            setStep(3);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "OTP không hợp lệ hoặc đã hết hạn.");
        } finally {
            setLoading(false);
        }
    };

    // === Step 3: Đặt lại mật khẩu ===
    const handleResetPassword = async () => {
        if (!newPassword.trim()) return alert("Vui lòng nhập mật khẩu mới");
        setLoading(true);
        try {
            const res = await axios.post(`${severUrl}/api/auth/resetPassword`, {
                email,
                password: newPassword,
            });
            alert(res.data.message || "Đặt lại mật khẩu thành công!");
            navigate("/signin");
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Không thể đặt lại mật khẩu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative w-full min-h-screen bg-black flex flex-col justify-center items-center text-sm overflow-hidden">
            {/* Hiệu ứng nền LiquidEther */}
            <div className="absolute inset-0 z-0">
                <LiquidEther
                    colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
                    mouseForce={20}
                    cursorSize={100}
                    isViscous={false}
                    viscous={30}
                    iterationsViscous={32}
                    iterationsPoisson={32}
                    resolution={0.5}
                    isBounce={false}
                    autoDemo={true}
                    autoSpeed={0.5}
                    autoIntensity={2.2}
                    takeoverDuration={0.25}
                    autoResumeDelay={3000}
                    autoRampDuration={0.6}
                />
            </div>

            {/* Nội dung chính */}
            <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center text-white">
                <div className="absolute top-6 text-3xl font-[Billabong]">LUMI</div>

                <div className="w-[90%] max-w-[400px] bg-[#000000]/80 border border-gray-700 rounded-md p-8 flex flex-col items-center text-center">
                    <div className="text-5xl mb-3">🔒</div>
                    <h2 className="text-lg font-semibold mb-2">
                        {step === 1
                            ? "Quên mật khẩu?"
                            : step === 2
                                ? "Nhập mã OTP"
                                : "Đặt lại mật khẩu"}
                    </h2>

                    {/* Step 1: Nhập email */}
                    {step === 1 && (
                        <>
                            <p className="text-gray-400 text-sm mb-5">
                                Nhập email để nhận mã OTP khôi phục mật khẩu.
                            </p>
                            <input
                                type="email"
                                placeholder="Nhập email của bạn"
                                className="w-full bg-transparent border border-gray-700 rounded-sm text-white px-3 py-2 mb-3 placeholder-gray-500 focus:outline-none"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button
                                onClick={handleSendOTP}
                                disabled={loading}
                                className="w-full bg-[#385898] hover:bg-[#2f4b8f] font-medium py-2 rounded-md transition-colors flex justify-center items-center"
                            >
                                {loading ? <ClipLoader size={22} color="#fff" /> : "Gửi mã OTP"}
                            </button>
                        </>
                    )}

                    {/* Step 2: Nhập OTP */}
                    {step === 2 && (
                        <>
                            <p className="text-gray-400 text-sm mb-5">
                                Mã OTP đã được gửi đến email {email}.
                            </p>
                            <input
                                type="text"
                                placeholder="Nhập mã OTP"
                                className="w-full bg-transparent border border-gray-700 rounded-sm text-white px-3 py-2 mb-3 placeholder-gray-500 focus:outline-none"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                            <button
                                onClick={handleVerifyOTP}
                                disabled={loading}
                                className="w-full bg-[#385898] hover:bg-[#2f4b8f] font-medium py-2 rounded-md transition-colors flex justify-center items-center"
                            >
                                {loading ? <ClipLoader size={22} color="#fff" /> : "Xác minh OTP"}
                            </button>
                        </>
                    )}

                    {/* Step 3: Đặt lại mật khẩu */}
                    {step === 3 && (
                        <>
                            <p className="text-gray-400 text-sm mb-5">
                                Nhập mật khẩu mới để hoàn tất đổi mật khẩu.
                            </p>
                            <input
                                type="password"
                                placeholder="Mật khẩu mới"
                                className="w-full bg-transparent border border-gray-700 rounded-sm text-white px-3 py-2 mb-3 placeholder-gray-500 focus:outline-none"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <button
                                onClick={handleResetPassword}
                                disabled={loading}
                                className="w-full bg-[#385898] hover:bg-[#2f4b8f] font-medium py-2 rounded-md transition-colors flex justify-center items-center"
                            >
                                {loading ? <ClipLoader size={22} color="#fff" /> : "Đặt lại mật khẩu"}
                            </button>
                        </>
                    )}
                </div>

                {/* Nút quay lại */}
                <div className="w-[90%] max-w-[400px] mt-3 bg-[#000000]/80 border border-gray-700 rounded-md text-center py-3 text-sm">
                    <button onClick={() => navigate("/signin")} className="hover:underline">
                        Quay lại đăng nhập
                    </button>
                </div>

                <footer className="mt-8 text-gray-500 text-xs flex flex-wrap justify-center gap-3 max-w-[90%] text-center">
                    <p>Meta</p>
                    <p>About</p>
                    <p>Blog</p>
                    <p>Jobs</p>
                    <p>Help</p>
                    <p>API</p>
                    <p>Privacy</p>
                    <p>Terms</p>
                    <p>Locations</p>
                    <p>Instagram Lite</p>
                    <p>Meta AI</p>
                    <p>Threads</p>
                </footer>
                <p className="text-gray-500 text-xs mt-3 mb-4">
                    © 2025 Instagram from Meta
                </p>
            </div>
        </div>
    );
}

export default ForgotPassword;

