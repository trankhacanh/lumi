import React, { useEffect, useRef, useState } from "react";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import dp from "../assets/dp.jpg";
import FollowButton from "./FollowButton";
import { BsThreeDots } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { severUrl } from "../App";
import { setLoopData } from "../redux/loopSlice";
import {
    FaHeart,
    FaRegHeart,
    FaRegComment,
    FaRegPaperPlane,
    FaBookmark,
    FaRegBookmark,
} from "react-icons/fa";

function LoopCard({ loop }) {
    const videoRef = useRef(null);
    const dispatch = useDispatch();
    const [showHeart, setShowHeart] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMute, setIsMute] = useState(false);
    const [progress, setProgress] = useState(0);

    // comment states
    const [showComment, setShowComment] = useState(false);
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);

    const commentRef = useRef(null);
    const clickTimeout = useRef(null);

    const { userData } = useSelector((state) => state.user);
    const { loopData } = useSelector((state) => state.loop);

    const isOwnLoop =
        loop?.author?._id && userData?._id && loop.author._id === userData._id;

    const isLiked = loop?.likes?.includes(userData?._id);

    // IntersectionObserver: play/pause khi video in viewport
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                const video = videoRef.current;
                if (!video) return;
                if (entry.isIntersecting) {
                    video.play().catch(() => { });
                    setIsPlaying(true);
                } else {
                    video.pause();
                    setIsPlaying(false);
                }
            },
            { threshold: 0.6 }
        );

        if (videoRef.current) observer.observe(videoRef.current);
        return () => {
            observer.disconnect(); // an toàn hơn unobserve
        };
    }, []);

    // click outside để đóng khung comment
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (commentRef.current && !commentRef.current.contains(event.target)) {
                setShowComment(false);
            }
        };

        if (showComment) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showComment]);

    // cleanup cho clickTimeout khi unmount
    useEffect(() => {
        return () => {
            if (clickTimeout.current) {
                clearTimeout(clickTimeout.current);
                clickTimeout.current = null;
            }
        };
    }, []);

    // play/pause on single click
    const handleClick = () => {
        const video = videoRef.current;
        if (!video) return;
        if (isPlaying) {
            video.pause();
            setIsPlaying(false);
        } else {
            video.play();
            setIsPlaying(true);
        }
    };

    // mute toggle
    const toggleMute = (e) => {
        e.stopPropagation();
        const video = videoRef.current;
        if (!video) return;
        video.muted = !isMute;
        setIsMute(!isMute);
    };

    // time update -> tiến trình
    const handleTimeUpdate = () => {
        const video = videoRef.current;
        if (!video || !video.duration) return;
        const currentProgress = (video.currentTime / video.duration) * 100;
        setProgress(currentProgress);
    };

    // like API + optimistic update
    const handleLike = async () => {
        try {
            // optimistic update: thay đổi UI trước
            const updatedLoopsOptimistic = loopData.map((p) => {
                if (p._id === loop._id) {
                    const hasLiked = p.likes?.includes(userData._id);
                    const newLikes = hasLiked
                        ? p.likes.filter((id) => id !== userData._id)
                        : [...(p.likes || []), userData._id];
                    return { ...p, likes: newLikes };
                }
                return p;
            });
            dispatch(setLoopData(updatedLoopsOptimistic));

            // thực hiện request (bạn có thể dùng POST/PUT tuỳ backend)
            await axios.get(`${severUrl}/api/loop/like/${loop._id}`, {
                withCredentials: true,
            });
            // không cần cập nhật lại từ response nếu backend không trả list mới
        } catch (err) {
            console.error("Error liking the post:", err);
            // optional: rollback nếu muốn (phức tạp hơn)
        }
    };

    const handleLikeOnDoubleClick = () => {
        setShowHeart(true);
        setTimeout(() => setShowHeart(false), 800);
        if (!loop.likes?.includes(userData?._id)) {
            handleLike();
        }
    };

    const handleVideoClick = () => {
        if (clickTimeout.current) {
            clearTimeout(clickTimeout.current);
            clickTimeout.current = null;
            handleLikeOnDoubleClick(); // double click
        } else {
            clickTimeout.current = setTimeout(() => {
                handleClick(); // single click (play/pause)
                clickTimeout.current = null;
            }, 250);
        }
    };

    const handleCommentClick = () => setShowComment(true);

    // ====== CHÍNH: gửi comment ======
    const handleComment = async () => {
        const text = message.trim();
        if (!text || sending) return;
        setSending(true);

        try {
            // gọi API gửi comment
            const res = await axios.post(
                `${severUrl}/api/loop/comment/${loop._id}`,
                { message: text },
                { withCredentials: true }
            );

            // backend nên trả về comment mới ở res.data.comment
            const newComment =
                res?.data?.comment || {
                    user: {
                        _id: userData?._id,
                        username: userData?.username || "Người dùng",
                        profileImage: userData?.profileImage || dp,
                    },
                    text,
                };

            // cập nhật redux (optimistic but persisted by response)
            const updatedLoops = loopData.map((p) =>
                p._id === loop._id
                    ? { ...p, comments: [...(p.comments || []), newComment] }
                    : p
            );

            dispatch(setLoopData(updatedLoops));
            setMessage("");
        } catch (err) {
            console.error("Error sending comment:", err);
            // có thể show toast lỗi ở đây
        } finally {
            setSending(false);
        }
    };

    // Enter để gửi
    const onKeyDownComment = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleComment();
        }
    };

    return (
        <div className="w-full lg:w-[480px] h-[100vh] flex items-center justify-center border-l-2 border-r-2 border-gray-800 relative bg-black">
            {/* VIDEO / IMAGE */}
            {loop?.media ? (
                <div className="relative w-full h-full">
                    <video
                        ref={videoRef}
                        autoPlay
                        loop
                        muted={isMute}
                        playsInline
                        src={loop.media}
                        className="w-full max-h-full object-cover cursor-pointer"
                        onTimeUpdate={handleTimeUpdate}
                        onClick={handleVideoClick}
                    />

                    {/* HEART POP */}
                    {showHeart && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <FaHeart className="text-red-500 text-7xl animate-pop drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                        </div>
                    )}
                </div>
            ) : (
                <img src={dp} alt="fallback" className="w-full h-full object-cover" />
            )}

            {/* RIGHT ACTIONS */}
            <div className="absolute right-5 bottom-28 flex flex-col items-center gap-6 text-white text-xl">
                <div className="flex flex-col items-center gap-1">
                    {isLiked ? (
                        <FaHeart
                            className="text-red-500 cursor-pointer hover:scale-110 transition"
                            onClick={handleLike}
                        />
                    ) : (
                        <FaRegHeart
                            className="cursor-pointer hover:scale-110 transition"
                            onClick={handleLike}
                        />
                    )}
                    <span className="text-xs opacity-80">{loop?.likes?.length || 0}</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                    <FaRegComment
                        className="cursor-pointer hover:scale-110 transition"
                        onClick={handleCommentClick}
                    />
                    <span className="text-xs opacity-80">{loop?.comments?.length || 0}</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                    <FaRegPaperPlane className="cursor-pointer hover:scale-110 transition" />
                </div>

                <div
                    onClick={toggleMute}
                    className="flex flex-col items-center gap-1 mt-3 cursor-pointer hover:scale-110 transition z-20"
                    title={isMute ? "Unmute" : "Mute"}
                >
                    {isMute ? (
                        <HiSpeakerXMark size={24} className="text-white" />
                    ) : (
                        <HiSpeakerWave size={24} className="text-white" />
                    )}
                </div>
            </div>

            {/* BOTTOM INFO */}
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent px-5 pb-6 pt-10 text-white flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img
                            src={loop?.author?.profileImage || dp}
                            alt="avatar"
                            className="w-11 h-11 rounded-full object-cover border border-white/30"
                        />
                        <div className="flex flex-col leading-tight">
                            <span className="font-semibold text-sm sm:text-base">
                                {loop?.author?.username || "Unknown User"}
                            </span>
                        </div>
                        {!isOwnLoop && loop?.author?._id && (
                            <FollowButton
                                tailwind="text-xs sm:text-sm font-semibold text-blue-500 hover:text-blue-400"
                                targetUserId={loop.author._id}
                            />
                        )}
                    </div>
                    <BsThreeDots className="text-lg opacity-70 cursor-pointer" />
                </div>

                {loop?.caption && (
                    <p className="text-sm sm:text-base mt-1 opacity-90 leading-snug line-clamp-3">
                        {loop.caption}
                    </p>
                )}

                <div className="w-full h-[3px] bg-gray-600 rounded-full mt-2">
                    <div
                        className="h-full bg-white rounded-full transition-all duration-200"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* ===== COMMENT PANEL (overlay bên phải) ===== */}
            {showComment && (
                <div
                    ref={commentRef}
                    className="absolute top-0 right-0 w-full sm:w-[380px] h-full bg-black/95 text-white border-l border-gray-700 flex flex-col z-30 animate-slideLeft"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-700">
                        <h2 className="text-lg font-semibold">Comments</h2>
                        <button
                            onClick={() => setShowComment(false)}
                            className="text-gray-400 hover:text-white text-xl"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Comments list */}
                    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scrollbar-hide">
                        {loop?.comments?.length > 0 ? (
                            loop.comments.map((c, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <img
                                        src={c.user?.profileImage || dp}
                                        alt="avatar"
                                        className="w-9 h-9 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="text-sm font-semibold">
                                            {c.user?.username || "User"}
                                        </p>
                                        <p className="text-sm text-gray-300">{c.text || c.message}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-sm text-center mt-10">
                                No comments yet. Be the first to comment!
                            </p>
                        )}
                    </div>

                    {/* Input */}
                    <div className="border-t border-gray-700 p-3 flex items-center gap-3">
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={onKeyDownComment}
                            className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400"
                        />
                        <button
                            className={`text-blue-500 font-semibold hover:text-blue-400 ${sending || !message.trim() ? "opacity-50 pointer-events-none" : ""
                                }`}
                            onClick={handleComment}
                        >
                            {sending ? "Posting..." : "Post"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LoopCard;
