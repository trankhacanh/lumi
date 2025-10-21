import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart, FaRegComment, FaRegPaperPlane, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { severUrl } from "../App";
import { setPostData } from "../redux/postSlice";
import { setUserData } from "../redux/userSlice";
import FollowButton from "./FollowButton";
import { useNavigate } from "react-router-dom";

function Post({ post }) {
    const { userData } = useSelector((state) => state.user);
    const { postData } = useSelector((state) => state.post);
    const { socket } = useSelector((state) => state.socket);
    const [showComments, setShowComments] = useState(false);
    const [commentMessage, setCommentMessage] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    if (!post) return null;

    const isOwnPost = post.author?._id === userData?._id;
    const isLiked = post.likes?.includes(userData?._id);

    // ===== Like post =====
    const handleLike = async () => {
        try {
            await axios.get(`${severUrl}/api/post/like/${post._id}`, { withCredentials: true });
            const updatedPosts = postData.map((p) => {
                if (p._id === post._id) {
                    const hasLiked = p.likes?.includes(userData._id);
                    const newLikes = hasLiked
                        ? p.likes.filter((id) => id !== userData._id)
                        : [...p.likes, userData._id];
                    return { ...p, likes: newLikes };
                }
                return p;
            });
            dispatch(setPostData(updatedPosts));

            // Emit like event socket
            socket?.emit("likedPost", { postId: post._id, userId: userData._id });
        } catch (err) {
            console.error("Error liking the post:", err);
        }
    };

    // ===== Save / unsave post =====
    const handleSaved = async () => {
        try {
            const result = await axios.get(`${severUrl}/api/post/saved/${post._id}`, { withCredentials: true });
            dispatch(setUserData(result.data));
        } catch (err) {
            console.error("Error saving the post:", err);
        }
    };

    // ===== Socket listeners =====
    useEffect(() => {
        socket?.on("likedPost", (updatedData) => {
            const updatedPosts = postData.map((p) =>
                p._id === updatedData.postId ? { ...p, likes: updatedData.likes } : p
            );
            dispatch(setPostData(updatedPosts));
        });

        socket?.on("commentedPost", (updatedData) => {
            const updatedPosts = postData.map((p) =>
                p._id === updatedData.postId ? { ...p, comments: updatedData.comments } : p
            );
            dispatch(setPostData(updatedPosts));
        });

        return () => {
            socket?.off("likedPost");
            socket?.off("commentedPost");
        };
    }, [socket, postData, dispatch]);

    // ===== Submit comment =====
    const handleCommentSubmit = async () => {
        const text = commentMessage.trim();
        if (!text) return;

        try {
            const res = await axios.post(
                `${severUrl}/api/post/comment/${post._id}`,
                { message: text },
                { withCredentials: true }
            );

            // Chuẩn hóa comment
            const newComment = res?.data?.comment || {
                user: {
                    _id: userData?._id,
                    username: userData?.username,
                    profileImage: userData?.profileImage || "/default-avatar.png",
                },
                text,
            };

            const updatedPosts = postData.map((p) =>
                p._id === post._id
                    ? { ...p, comments: [...(p.comments || []), newComment] }
                    : p
            );

            dispatch(setPostData(updatedPosts));
            setCommentMessage("");
            setShowComments(true);

            // Emit comment socket
            socket?.emit("commentedPost", { postId: post._id, comment: newComment });
        } catch (err) {
            console.error("Error posting comment:", err);
        }
    };

    const onKeyDownComment = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleCommentSubmit();
        }
    };

    // ===== Chuẩn hóa dữ liệu comment để luôn có user và text =====
    const normalizedComments = post.comments?.map((c) => ({
        user: c.user || c.author || { _id: "unknown", username: "Unknown", profileImage: "/default-avatar.png" },
        text: c.text || c.message || "",
    })) || [];

    return (
        <div className="w-full max-w-[500px] bg-black text-white border-b border-gray-800 mx-auto">
            {/* Header */}
            <div
                className="flex items-center justify-between p-3 cursor-pointer"
                onClick={() => navigate(`/profile/${post.author?.username}`)}
            >
                <div className="flex items-center gap-3">
                    <img
                        src={post.author?.profileImage || "/default-avatar.png"}
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex flex-col leading-tight">
                        <span className="font-semibold text-sm sm:text-base">{post.author?.username}</span>
                        {post.location && <span className="text-xs text-gray-400">{post.location}</span>}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {!isOwnPost && (
                        <FollowButton
                            tailwind="text-xs sm:text-sm font-semibold text-blue-500 hover:text-blue-400"
                            targetUserId={post.author._id}
                        />
                    )}
                    <BsThreeDots className="text-xl cursor-pointer" />
                </div>
            </div>

            {/* Media */}
            <div className="w-full bg-black">
                {post.mediaType === "video" ? (
                    <video src={post.media} controls className="w-full max-h-[600px] object-contain" />
                ) : (
                    <img src={post.media} alt="post" className="w-full max-h-[600px] object-contain" />
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center gap-4 text-xl">
                    {isLiked ? (
                        <FaHeart className="text-red-500 cursor-pointer" onClick={handleLike} />
                    ) : (
                        <FaRegHeart className="cursor-pointer" onClick={handleLike} />
                    )}
                    <FaRegComment
                        className="cursor-pointer"
                        onClick={() => setShowComments(!showComments)}
                    />
                    <FaRegPaperPlane className="cursor-pointer" />
                </div>
                <div className="text-xl" onClick={handleSaved}>
                    {userData?.saved?.includes(post?._id) ? (
                        <FaBookmark className="cursor-pointer text-yellow-400" />
                    ) : (
                        <FaRegBookmark className="cursor-pointer" />
                    )}
                </div>
            </div>

            {/* Likes */}
            <div className="px-3">
                <span className="font-semibold">{post.likes?.length || 0} lượt thích</span>
            </div>

            {/* Caption */}
            <div className="px-3 py-1 text-sm sm:text-base">
                <span className="font-semibold mr-2">{post.author?.username}</span>
                <span>{post.caption}</span>
            </div>

            {/* Comment Panel */}
            {showComments && (
                <div className="px-3 py-2 border-t border-gray-700 bg-gray-900/90">
                    {normalizedComments.length > 0 ? (
                        normalizedComments.map((c, index) => (
                            <div key={index} className="flex items-start gap-2 py-1">
                                <img
                                    src={c.user?.profileImage || "/default-avatar.png"}
                                    alt="avatar"
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                                <div>
                                    <span className="font-semibold text-sm">{c.user?.username}</span>
                                    <p className="text-sm text-gray-300">{c.text}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400 text-sm text-center py-2">No comments yet. Be the first!</p>
                    )}

                    {/* Input comment */}
                    <div className="flex items-center gap-2 mt-2">
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            value={commentMessage}
                            onChange={(e) => setCommentMessage(e.target.value)}
                            onKeyDown={onKeyDownComment}
                            className="flex-1 bg-transparent outline-none border-b border-gray-600 text-sm placeholder-gray-400 px-2 py-1"
                        />
                        <button
                            onClick={handleCommentSubmit}
                            className={`text-blue-500 font-semibold ${!commentMessage.trim() && "opacity-50 pointer-events-none"}`}
                        >
                            Post
                        </button>
                    </div>
                </div>
            )}

            {/* Time */}
            <div className="px-3 py-2 text-xs text-gray-500 uppercase">
                {post.createdAt ? new Date(post.createdAt).toLocaleDateString("vi-VN") : "Vừa xong"}
            </div>
        </div>
    );
}

export default Post;
