import React from "react";
import { useSelector } from "react-redux";

function ReceiverMessage({ message }) {
    const { selectedUser } = useSelector((state) => state.message);

    return (
        <div className="flex items-end justify-start px-4 mb-3 ml-20">
            {/* Avatar người gửi */}
            {selectedUser?.profileImage && (
                <div className="w-[36px] h-[36px] rounded-full overflow-hidden mr-3 border border-gray-700 bg-black shadow-sm">
                    <img
                        src={selectedUser.profileImage}
                        alt="avatar"
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* Khung tin nhắn */}
            <div className="max-w-[70%] bg-[#242727] px-4 py-3 rounded-2xl rounded-tl-none text-white shadow-[0_2px_10px_rgba(0,0,0,0.2)]">
                {/* Hình ảnh (nếu có) */}
                {message.image && (
                    <img
                        src={message.image}
                        alt=""
                        className="max-h-[250px] w-auto rounded-xl mb-2 object-cover"
                    />
                )}

                {/* Nội dung tin nhắn */}
                {message.message && (
                    <p className="text-[15px] leading-snug whitespace-pre-wrap break-words">
                        {message.message}
                    </p>
                )}
            </div>
        </div>
    );
}

export default ReceiverMessage;
