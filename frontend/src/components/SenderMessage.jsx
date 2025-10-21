import React from "react";
import { useSelector } from "react-redux";

function SenderMessage({ message }) {
    const { userData } = useSelector((state) => state.user);


    return (
        <div className="flex justify-end px-4">
            <div className="relative max-w-[65%] bg-gradient-to-br from-[#9500ff] to-[#ff0095] rounded-t-2xl rounded-bl-2xl px-4 py-3 text-white shadow-md">
                {message.image && (
                    <img
                        src={message.image}
                        alt=""
                        className="max-h-[250px] w-auto rounded-xl mb-2 object-cover"
                    />
                )}

                {message.message && (
                    <div className="text-[15px] leading-snug whitespace-pre-wrap break-words">
                        {message.message}
                    </div>
                )}

                {/* Avatar người gửi */}
                {userData?.profileImage && (
                    <div className="w-[32px] h-[32px] rounded-full overflow-hidden absolute -right-[42px] bottom-0 border border-gray-700 bg-black shadow-md">
                        <img
                            src={userData.profileImage}
                            alt="avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default SenderMessage;
