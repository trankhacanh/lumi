import React, { useState } from "react";
import LiquidEther from "../components/magicui/LiquidEther.jsx";
import { IoEye, IoEyeOff } from "react-icons/io5";
import axios from "axios";
import { severUrl } from "../App.jsx";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { setUserData } from "../redux/userSlice.js";
import { useDispatch } from "react-redux";

function SignUp() {
    const [inputClicked, setInputClicked] = useState({
        name: false,
        userName: false,
        email: false,
        password: false
    });
    const [name, setName] = useState("");
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleSignUp = async () => {
        setLoading(true);
        try {
            const result = await axios.post(`${severUrl}/api/auth/signup`, {
                email,
                password,
                name,
                username: userName,
            });
            dispatch(setUserData(result.data));
            console.log("Sign up success:", result.data);

            setLoading(false);
        }
        catch (error) {
            console.error("Error during sign up:", error);
            setLoading(false);
        }
    };
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="relative w-full min-h-screen bg-black flex flex-col justify-center items-center text-sm overflow-hidden">
            {/* Hiệu ứng nền LiquidEther */}
            <div className="absolute inset-0 z-0">
                <LiquidEther
                    colors={['#5227FF', '#FF9FFC', '#B19EEF']}
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

            {/* Toàn bộ nội dung form nằm trên nền */}
            <div className="relative z-10 flex flex-col items-center">
                {/* Form đăng ký */}
                <div className="w-[90%] max-w-[380px] bg-[#000000]/70 backdrop-blur-sm border border-gray-700 rounded-md p-6 flex flex-col items-center">
                    <h1 className="text-4xl font-[Billabong] text-white mb-4">
                        LUMI
                    </h1>

                    <p className="text-gray-400 text-center mb-4">
                        Sign up to see photos and videos <br /> from your friends.
                    </p>

                    {/* Nút đăng nhập Facebook */}
                    <button className="bg-[#4267B2] text-white font-semibold rounded-md w-full py-2 mb-3">
                        Log in with Facebook
                    </button>

                    {/* Dòng chia tách */}
                    <div className="flex items-center w-full my-3">
                        <hr className="flex-1 border-gray-700" />
                        <span className="mx-2 text-gray-400 text-xs">OR</span>
                        <hr className="flex-1 border-gray-700" />
                    </div>

                    {/* Form nhập */}
                    <input
                        type="text"
                        placeholder="Mobile Number or Email"
                        className="w-full bg-transparent border border-gray-700 rounded-sm text-white px-3 py-2 mb-2 placeholder-gray-500 focus:outline-none"
                        onClick={() => setInputClicked({ ...inputClicked, email: true })}
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="relative w-full mb-2">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="w-full bg-transparent border border-gray-700 rounded-sm text-white px-3 py-2 placeholder-gray-500 focus:outline-none"
                            onClick={() => setInputClicked({ ...inputClicked, password: true })}
                            required
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
                    <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full bg-transparent border border-gray-700 rounded-sm text-white px-3 py-2 mb-2 placeholder-gray-500 focus:outline-none"
                        onClick={() => setInputClicked({ ...inputClicked, name: true })}
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Username"
                        className="w-full bg-transparent border border-gray-700 rounded-sm text-white px-3 py-2 mb-3 placeholder-gray-500 focus:outline-none"
                        onClick={() => setInputClicked({ ...inputClicked, userName: true })}
                        required
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />

                    <p className="text-[11px] text-gray-500 text-center mb-3">
                        People who use our service may have uploaded your contact information
                        to Instagram. <span className="text-blue-400">Learn More</span>
                    </p>

                    <p className="text-[11px] text-gray-500 text-center mb-4">
                        By signing up, you agree to our{" "}
                        <span className="text-blue-400">Terms</span>,{" "}
                        <span className="text-blue-400">Privacy Policy</span> and{" "}
                        <span className="text-blue-400">Cookies Policy</span>.
                    </p>


                    <button
                        className="bg-[#385898] text-white font-semibold rounded-md w-full py-2 hover:bg-[#2f4b8f] transition-colors flex justify-center items-center"
                        onClick={handleSignUp}
                        disabled={loading}
                    >
                        {loading ? (
                            <ClipLoader size={24} color="#ffffff" />
                        ) : (
                            "Sign Up"
                        )}
                    </button>

                </div>

                <div className="w-[90%] max-w-[380px] bg-[#000000]/70 backdrop-blur-sm border border-gray-700 rounded-md mt-3 p-4 text-center text-gray-400">
                    Have an account?{" "}
                    <button
                        onClick={() => navigate("/signin")}
                        className="text-blue-400 font-medium hover:underline"
                    >
                        Log in
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
                    <p>Threads</p>
                </footer>
                <p className="text-gray-500 text-xs mt-3">© 2025 Instagram from Meta</p>
            </div>
        </div>
    );
}

export default SignUp;
