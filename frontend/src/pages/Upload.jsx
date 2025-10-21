import React, { use, useState } from "react";
import { FaImage, FaVideo } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { BsThreeDots } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";
import LeftHome from "../components/LeftHome";
import Nav from "../components/Nav";
import { useSelector } from "react-redux";
import dp from "../assets/dp.jpg";
import axios from "axios";
import { severUrl } from "../App";
import { useDispatch } from "react-redux";
import { setPostData } from "../redux/postSlice";
import { setCurrentUserStory, setStoryData } from "../redux/storySlice";
import { setLoopData } from "../redux/loopSlice";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { setUserData } from "../redux/userSlice";
import { useEffect } from "react";

function Upload() {
    const [frontendMedia, setFrontendMedia] = useState(null);
    const [backendMedia, setBackendMedia] = useState(null);
    const [mediaType, setMediaType] = useState(null);
    const [uploadType, setUploadType] = useState("post");
    const { profileData, userData } = useSelector((state) => state.user);
    const [caption, setCaption] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { postData } = useSelector((state) => state.post);
    console.log("Post data in upload page:", postData);

    const { storyData } = useSelector((state) => state.story);
    console.log("Story data in upload page:", storyData);

    const { loopData } = useSelector((state) => state.loop);
    console.log("Loop data in upload page:", loopData);


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        console.log(file);
        if (!file) return;
        if (file.type.includes("image")) {
            setMediaType("image");
        } else {
            setMediaType("video");
        }
        setBackendMedia(file);
        setFrontendMedia(URL.createObjectURL(file));
    };

    const handleBack = () => {
        setFrontendMedia(null);
        setBackendMedia(null);
        setMediaType(null);
    };

    const uploadPost = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("media", backendMedia);
            formData.append("mediaType", mediaType);
            formData.append("caption", caption);
            const result = await axios.post(`${severUrl}/api/post/upload`, formData, { withCredentials: true });
            dispatch(setPostData([...postData, result.data]));
            setLoading(false);
            console.log("Upload success:", result.data);
            navigate("/");
        } catch (err) {
            console.error("Error uploading post:", err);
        }
    }

    const uploadStory = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("media", backendMedia);
            formData.append("mediaType", mediaType);
            formData.append("caption", caption);
            const result = await axios.post(`${severUrl}/api/story/upload`, formData, { withCredentials: true });

            dispatch(setCurrentUserStory(result.data));
            setLoading(false);
            console.log("Upload success:", result.data);
            navigate("/");
        } catch (err) {
            console.error("Error uploading post:", err);
        }
    }

    const uploadLoop = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("media", backendMedia);
            formData.append("caption", caption);
            const result = await axios.post(`${severUrl}/api/loop/upload`, formData, { withCredentials: true });
            dispatch(setLoopData([...loopData, result.data]));
            setLoading(false);
            console.log("Upload success:", result.data);
            navigate("/");
        } catch (err) {
            console.error("Error uploading post:", err);
        }
    }
    const handleUpload = () => {
        setLoading(true);
        if (uploadType === "post") {
            uploadPost();
        } else if (uploadType === "story") {
            uploadStory();
        }
        else if (uploadType === "loop" ? "video/*" : "") {
            uploadLoop();
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-black text-white">
            {/* Ẩn LeftHome trên mobile */}
            <div className="hidden md:block">
                <LeftHome />
            </div>

            <div className="w-full max-w-[700px] rounded-2xl bg-[#1c1c1c] shadow-lg overflow-hidden relative mx-2 md:mx-0">
                {/* Header */}
                <div className="flex justify-between items-center px-4 py-3 border-b border-gray-700">
                    {frontendMedia ? (
                        <button
                            onClick={handleBack}
                            className="flex items-center text-gray-300 hover:text-white"
                        >
                            <IoIosArrowBack size={22} />
                            <span className="ml-1 text-sm">Back</span>
                        </button>
                    ) : (
                        <div></div>
                    )}
                    <h2 className="font-semibold text-base sm:text-lg text-center flex-1">
                        Create new post
                    </h2>
                    <button className="text-blue-500 hover:text-blue-400 text-sm sm:text-base">
                        Share
                    </button>
                </div>

                {/* AnimatePresence quản lý chuyển cảnh */}
                <AnimatePresence mode="wait">
                    {!frontendMedia ? (
                        // GIAO DIỆN CHỌN ẢNH
                        <motion.div
                            key="select"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="flex flex-col justify-center items-center h-[450px] sm:h-[500px] p-4 text-center"
                        >
                            {/* Chọn kiểu đăng */}
                            <div className="flex flex-wrap justify-center items-center gap-3 mb-6">
                                {["post", "story", "loop"].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setUploadType(type)}
                                        className={`px-4 py-1 rounded-full border text-sm sm:text-base ${uploadType === type
                                            ? "bg-blue-500 text-white border-blue-500"
                                            : "border-gray-600 text-gray-400 hover:text-white"
                                            }`}
                                    >
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </button>
                                ))}
                            </div>

                            {/* Khung tải ảnh / video */}
                            <div className="flex flex-col items-center text-gray-300 text-center">
                                <div className="text-4xl mb-4">
                                    <FaImage className="inline mr-2" />
                                    <FaVideo className="inline" />
                                </div>

                                <p className="mb-4 text-base">
                                    Drag{" "}
                                    {mediaType
                                        ? mediaType + "s"
                                        : "photos and videos"}{" "}
                                    here
                                </p>

                                <label className="bg-blue-600 hover:bg-blue-700 cursor-pointer px-5 py-2 rounded-md text-sm sm:text-base">
                                    Select from device
                                    <input
                                        type="file"
                                        accept="image/*,video/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </motion.div>
                    ) : (
                        // GIAO DIỆN XEM TRƯỚC
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="flex flex-col md:flex-row h-[calc(100vh-140px)] md:h-[550px]"
                        >
                            {/* Preview section */}
                            <div className="flex-1 bg-black flex justify-center items-center">
                                {mediaType === "video" ? (
                                    <video
                                        src={frontendMedia}
                                        controls
                                        className="max-h-[400px] md:max-h-[500px] rounded-lg w-full object-contain"
                                    />
                                ) : (
                                    <img
                                        src={frontendMedia}
                                        alt="preview"
                                        className="max-h-[400px] md:max-h-[500px] rounded-lg object-contain w-full"
                                    />
                                )}
                            </div>

                            {/* Info section */}
                            <div className="w-full md:w-[300px] bg-[#111] border-t md:border-t-0 md:border-l border-gray-800 flex flex-col">
                                <div className="flex items-center gap-2 p-3 border-b border-gray-800">
                                    <img
                                        src={profileData?.profileImage || userData?.profileImage || dp}
                                        alt="avatar"
                                        className="rounded-full w-10 h-10 object-cover border border-gray-700"
                                    />
                                    <div>
                                        <p className="font-semibold text-sm sm:text-base">
                                            {profileData?.username || userData?.username || "Người dùng"}
                                        </p>
                                        <p className="text-xs text-gray-400">{uploadType}</p>
                                    </div>
                                    <div className="ml-auto text-gray-400 hover:text-white cursor-pointer">
                                        <BsThreeDots />
                                    </div>
                                </div>

                                <textarea
                                    placeholder={`Viết mô tả cho ${uploadType} của bạn...`}
                                    className="flex-1 bg-transparent text-sm p-3 outline-none resize-none text-gray-200"
                                    maxLength={2200}
                                    onChange={(e) => setCaption(e.target.value)}
                                    value={caption}
                                />


                                <div className="border-t border-gray-800 text-sm text-gray-400 p-3 flex flex-col gap-2">
                                    <button className="hover:text-white text-left">Thêm vị trí</button>
                                    <button className="hover:text-white text-left">Thêm người hợp tác</button>
                                </div>

                                <div className="border-t border-gray-800 p-3">
                                    <button
                                        onClick={handleUpload}
                                        className="w-full py-2 rounded-md bg-blue-600 hover:bg-blue-700 font-medium flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <ClipLoader size={30} color="white" />
                                        ) : (
                                            `Đăng ${uploadType}`
                                        )}
                                    </button>
                                </div>

                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <Nav />
        </div>
    );
}

export default Upload;
