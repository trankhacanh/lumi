import React, { useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { severUrl } from "../App.jsx";
import LiquidEther from "../components/magicui/LiquidEther.jsx";
import { FaFacebook } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice.js";

function Signin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async () => {
        setLoading(true);
        try {
            const result = await axios.post(`${severUrl}/api/auth/signin`, {
                username,
                password,
            }, { withCredentials: true }); // Thêm { withCredentials: true } để gửi cookie

            const { user, token } = result.data;
            dispatch(setUserData(user));
            localStorage.setItem("token", token);

            console.log("Login success:", result.data);
            navigate("/home");
        } catch (error) {
            console.error("Login error:", error);
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
            <div className="relative z-10 flex flex-col lg:flex-row justify-center items-center gap-12 w-[90%] max-w-5xl py-12 text-white">
                {/* Cột trái - ảnh landing */}
                <div className="hidden lg:flex justify-center items-center">
                    <img
                        src="/assets/1x.png"
                        alt="Instagram Preview"
                        className="w-[600px] h-auto rounded-xl shadow-xl"
                    />
                </div>

                {/* Cột phải - form đăng nhập */}
                <div className="flex flex-col items-center w-[90%] max-w-[380px]">
                    <div className="w-full bg-[#000000]/70 border border-gray-700 backdrop-blur-sm rounded-md p-6 flex flex-col items-center">
                        <h1 className="text-5xl font-[Billabong] text-white mb-6">LUMI</h1>

                        <input
                            type="text"
                            placeholder="Username"
                            className="w-full bg-transparent border border-gray-700 rounded-sm text-white px-3 py-2 mb-2 placeholder-gray-500 focus:outline-none"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        <div className="relative w-full mb-3">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="w-full bg-transparent border border-gray-700 rounded-sm text-white px-3 py-2 placeholder-gray-500 focus:outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                                {showPassword ? <IoEyeOff size={18} /> : <IoEye size={18} />}
                            </button>
                        </div>

                        <button
                            className="bg-[#385898] text-white font-semibold rounded-md w-full py-2 hover:bg-[#2f4b8f] transition-colors flex justify-center items-center"
                            onClick={handleLogin}
                            disabled={loading}
                        >
                            {loading ? <ClipLoader size={24} color="#ffffff" /> : "Log in"}
                        </button>

                        <div className="flex items-center w-full my-3">
                            <hr className="flex-1 border-gray-700" />
                            <span className="mx-2 text-gray-400 text-xs">OR</span>
                            <hr className="flex-1 border-gray-700" />
                        </div>

                        <button className="text-blue-400 font-medium flex items-center gap-2 hover:underline">
                            <FaFacebook />
                            Log in with Facebook
                        </button>

                        <button
                            className="text-[12px] text-blue-400 mt-3 hover:underline"
                            onClick={() => navigate("/forgot-password")}
                        >
                            Forgot password?
                        </button>
                    </div>

                    <div className="w-full bg-[#000000]/70 border border-gray-700 rounded-md mt-3 p-4 text-center text-gray-400">
                        Don't have an account?{" "}
                        <button
                            onClick={() => navigate("/signup")}
                            className="text-blue-400 font-medium hover:underline"
                        >
                            Sign up
                        </button>
                    </div>

                    {/* Footer */}
                    <footer className="mt-6 text-gray-500 text-xs flex flex-wrap justify-center gap-2 max-w-[90%] text-center">
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
                    <p className="text-gray-500 text-xs mt-3">
                        © 2025 Instagram from Meta
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signin;
