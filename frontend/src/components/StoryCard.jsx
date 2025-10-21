import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import dp from "../assets/dp.jpg";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa6";


function StoryCard() {
    const { storyData } = useSelector((state) => state.story);
    const [progress, setProgress] = React.useState(0);
    const navigate = useNavigate();
    const { userData } = useSelector((state) => state.user);
    if (!storyData) return null;
    const viewerCount = storyData?.viewers?.length || 0;
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    navigate("/");
                    return 100;
                }
                return prev + 1;
            });
        }, 50);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full max-w-[500px] h-[100vh] bg-black border-x border-gray-800 overflow-hidden text-white">
            {/* Thanh tiến trình */}
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gray-700">
                <div
                    className="h-full bg-white transition-all duration-100 ease-linear"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            {/* Header - avatar và username */}
            <div className="absolute top-5 left-5 flex items-center gap-3 z-10">
                <img
                    src={storyData?.author?.profileImage || dp}
                    alt="avatar"
                    className="w-11 h-11 rounded-full object-cover border border-white/30"
                />
                <div className="flex flex-col leading-tight">
                    <span className="font-semibold text-sm sm:text-base">
                        {storyData?.author?.username || "Unknown User"}
                    </span>
                </div>
            </div>

            {/* Ảnh hoặc video story */}
            <div className="w-full h-full flex justify-center items-center">
                {storyData?.mediaType === "image" && (
                    <img
                        src={storyData.media}
                        alt="story"
                        className="max-h-[90vh] object-contain rounded-lg"
                    />
                )}
                {storyData?.mediaType === "video" && (
                    <video
                        src={storyData.media}
                        controls
                        autoPlay
                        className="max-h-[90vh] rounded-lg"
                    />
                )}
            </div>

            {/* Caption (nếu có) */}
            {storyData.caption && (
                <p className="absolute bottom-8 w-full text-center text-gray-200 px-4">
                    {storyData.caption}
                </p>
            )}

            <div className="absolute bottom-4 left-0 w-full flex justify-center text-sm text-gray-400">
                <div className="flex items-center gap-2">
                    <FaEye className="text-gray-400" />
                    <span>{viewerCount} người đã xem</span>
                </div>
            </div>
        </div>
    );
}

export default StoryCard;
