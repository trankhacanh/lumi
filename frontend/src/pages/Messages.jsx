import React, { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { IoMdSend } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import LeftHome from "../components/LeftHome";
import { useNavigate } from "react-router-dom";
import { setSelectedUser } from "../redux/mesageSlice";

const Message = () => {
    const { userData, suggestedUsers } = useSelector((state) => state.user);
    const [isCollapsed, setIsCollapsed] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // 👉 Hàm xử lý khi chọn người để nhắn tin
    const handleSelectUser = (user) => {
        dispatch(setSelectedUser(user)); // Lưu người được chọn vào Redux
        navigate("/messageArea");        // Điều hướng sang trang nhắn tin
    };

    return (
        <div className="bg-black text-white min-h-screen flex">
            {/* Sidebar */}
            <div
                className={`${isCollapsed ? "w-20" : "w-64"
                    } transition-all duration-300 border-r border-gray-800`}
            >
                <LeftHome collapsed={isCollapsed} />
            </div>

            {/* Main content */}
            <div className="flex-1 flex">
                {/* Left messages list */}
                <div className="w-96 border-r border-gray-800 flex flex-col">
                    <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                        <h2 className="text-xl font-semibold">
                            {userData?.username || "username"}
                        </h2>
                        <button
                            className="text-gray-400 hover:text-white text-sm"
                            onClick={() => setIsCollapsed(!isCollapsed)}
                        >
                            {isCollapsed ? "Expand" : "Collapse"}
                        </button>
                    </div>

                    {/* Search bar */}
                    <div className="p-3">
                        <div className="flex items-center bg-neutral-900 rounded-lg px-3 py-2">
                            <BiSearch size={20} className="text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search"
                                className="bg-transparent outline-none text-sm ml-2 w-full"
                            />
                        </div>
                    </div>

                    {/* Message list */}
                    <div className="flex-1 overflow-y-auto">
                        {suggestedUsers && suggestedUsers.length > 0 ? (
                            suggestedUsers.slice(0, 10).map((user, index) => (
                                <div
                                    key={index}
                                    className="flex items-center space-x-3 p-3 hover:bg-neutral-900 cursor-pointer transition"
                                    onClick={() => handleSelectUser(user)} // ✅ dùng hàm riêng
                                >
                                    {user.profileImage ? (
                                        <img
                                            src={user.profileImage}
                                            alt={user.username}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 bg-gray-700 rounded-full" />
                                    )}
                                    <div>
                                        <p className="text-sm font-medium text-white">
                                            {user.username}
                                        </p>
                                        <p className="text-xs text-gray-400">Active recently</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-sm p-3">No users found</p>
                        )}
                    </div>
                </div>

                {/* Right message area */}
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 border-2 border-gray-500 rounded-full flex items-center justify-center mb-4">
                        <IoMdSend size={40} className="text-gray-500" />
                    </div>
                    <h2 className="text-xl font-semibold mb-1">Your messages</h2>
                    <p className="text-gray-400 text-sm mb-4">
                        Send a message to start a chat.
                    </p>
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-500 transition"
                        onClick={() => navigate("/messageArea")}
                    >
                        Send message
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Message;
