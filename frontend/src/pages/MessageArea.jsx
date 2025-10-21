import React, { use, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { IoMdSend } from "react-icons/io";
import { LuImage } from "react-icons/lu";
import axios from "axios";
import LeftHome from "../components/LeftHome";
import SenderMessage from "../components/SenderMessage";
import ReceiverMessage from "../components/ReceiverMessage";
import { severUrl } from "../App";
import { setMessages } from "../redux/mesageSlice";


function MessageArea() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const reduxSelectedUser = useSelector((state) => state.message.selectedUser);
    const { messages } = useSelector((state) => state.message);
    const { userData } = useSelector((state) => state.user);
    const { socket } = useSelector((state) => state.socket);
    const selectedUser =
        reduxSelectedUser || JSON.parse(localStorage.getItem("selectedUser"));

    const [input, setInput] = useState("");
    const imageInput = useRef();
    const [frontendImage, setFrontendImage] = useState(null);
    const [backendImage, setBackendImage] = useState(null);

    const messagesEndRef = useRef(null); // ✅ ref để cuộn xuống cuối

    useEffect(() => {
        if (!selectedUser) navigate("/");
    }, [selectedUser, navigate]);

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBackendImage(file);
            setFrontendImage(URL.createObjectURL(file));
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("message", input);
            if (backendImage) {
                formData.append("image", backendImage);
            }
            if (!selectedUser?._id) return;
            const result = await axios.post(
                `${severUrl}/api/message/send/${selectedUser._id}`,
                formData,
                { withCredentials: true }
            );
            dispatch(setMessages([...messages, result.data]));
            setInput("");
            setFrontendImage(null);
            setBackendImage(null);
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };

    const getAllMessages = async () => {
        try {
            if (!selectedUser?._id) return;
            const res = await axios.get(
                `${severUrl}/api/message/getAll/${selectedUser._id}`,
                { withCredentials: true }
            );
            dispatch(setMessages(res.data));
        } catch (err) {
            console.error("Error fetching messages:", err);
        }
    };

    useEffect(() => {
        getAllMessages();
    }, [selectedUser]);

    // ✅ Cuộn xuống cuối khi messages thay đổi hoặc khi mở trang
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    useEffect(() => {
        socket?.on("newMessage", (mess) => {
            dispatch(setMessages([...messages, mess]));
        });
        return () => socket?.off("newMessage");
        
    }, [messages, setMessages]);
    return (
        <div className="w-full h-screen bg-black text-white flex overflow-hidden">
            {/* Sidebar bên trái */}
            <div className="fixed top-0 left-0 h-full w-[220px] z-40">
                <LeftHome />
            </div>

            {/* Khung chính */}
            <div className="ml-[220px] flex-1 flex flex-col relative overflow-hidden">
                {/* Header */}
                <div
                    className="flex items-center gap-3 px-6 py-3 fixed top-0 left-[220px] right-0 z-30 bg-black border-b border-gray-800 cursor-pointer ml-20"
                    onClick={() => navigate(`/profile/${selectedUser?.username}`)}
                >
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-700 flex items-center justify-center">
                        {selectedUser?.profileImage ? (
                            <img
                                src={selectedUser.profileImage}
                                alt="avatar"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <CgProfile size={28} className="text-gray-400" />
                        )}
                    </div>
                    <div className="flex flex-col justify-center">
                        <span className="text-sm font-semibold">
                            {selectedUser?.username || "Người dùng"}
                        </span>
                        <span className="text-xs text-gray-400">
                            {selectedUser?.name || "Đang hoạt động"}
                        </span>
                    </div>
                </div>

                {/* Nội dung tin nhắn */}
                <div
                    className="flex-1 overflow-y-auto mt-[60px] mb-[90px] px-6 py-4 space-y-4 scroll-smooth mr-10 [&::-webkit-scrollbar]:hidden"
                    style={{
                        scrollbarWidth: "none",
                        overflowX: "hidden",
                    }}
                >
                    {messages?.length > 0 ? (
                        <>
                            {messages.map((mess, index) =>
                                mess.sender === userData?._id ? (
                                    <SenderMessage key={mess._id || index} message={mess} />
                                ) : (
                                    <ReceiverMessage key={mess._id || index} message={mess} />
                                )
                            )}
                            {/* ✅ điểm cuộn xuống cuối */}
                            <div ref={messagesEndRef}></div>
                        </>
                    ) : (
                        <div className="text-gray-500 text-center mt-10">
                            Chưa có tin nhắn nào
                        </div>
                    )}
                </div>

                {/* Ô nhập tin nhắn */}
                <div className="fixed bottom-0 right-0 h-[80px] w-[calc(100%-220px)] flex justify-center items-center bg-black z-30 border-t border-gray-800 ">
                    <form
                        className="w-[92%] max-w-[850px] h-[60px] rounded-full bg-[#131616] flex items-center gap-3 px-4 relative"
                        onSubmit={handleSendMessage}
                    >
                        {frontendImage && (
                            <div className="w-[90px] h-[90px] absolute top-[-110px] right-[15px] overflow-hidden rounded-2xl border border-gray-700">
                                <img
                                    src={frontendImage}
                                    alt="preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            ref={imageInput}
                            onChange={handleImage}
                        />

                        <input
                            type="text"
                            placeholder="Nhập tin nhắn..."
                            className="flex-1 text-[16px] text-white bg-transparent outline-none"
                            onChange={(e) => setInput(e.target.value)}
                            value={input}
                        />

                        <LuImage
                            className="w-6 h-6 text-white cursor-pointer hover:scale-110 transition"
                            onClick={() => imageInput.current.click()}
                        />

                        {(input || frontendImage) && (
                            <button
                                className="w-[45px] h-[45px] rounded-full bg-gradient-to-br from-[#9500ff] to-[#ff0095] flex items-center justify-center hover:opacity-90 transition"
                                type="submit"
                            >
                                <IoMdSend className="w-5 h-5 text-white" />
                            </button>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default MessageArea;
