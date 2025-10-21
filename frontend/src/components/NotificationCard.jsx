import React from "react";
import { CgProfile } from 'react-icons/cg';

function NotificationCard({ noti }) {
    const sender = noti?.sender || {};

    return (
        <div className="w-full flex items-center justify-between p-4 min-h-[70px] bg-gray-900 rounded-xl hover:bg-gray-800 transition-all duration-300 border border-gray-700 shadow-lg">
            {/* Left side - User info and message */}
            <div className="flex items-start space-x-3 flex-1 min-w-0">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    {sender?.profileImage ? (
                        <img
                            src={sender.profileImage}
                            alt="avatar"
                            className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center border-2 border-blue-500">
                            <CgProfile size={20} className="text-gray-400" />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col">
                        <div className="flex items-baseline space-x-2 mb-1">
                            <span className="text-[14px] text-white font-semibold truncate">
                                {sender?.username || "Unknown User"}
                            </span>
                            <span className="text-[12px] text-gray-400 truncate">
                                {sender?.name || "User"}
                            </span>
                        </div>

                        <div className="text-[13px] text-gray-200 line-clamp-2">
                            {noti?.message || "New notification"}
                        </div>

                        {/* Notification type and time */}
                        <div className="flex items-center space-x-3 mt-1">
                            {noti?.type && (
                                <span className="text-[11px] text-blue-400 font-medium px-2 py-1 bg-blue-400/10 rounded-full">
                                    {noti.type}
                                </span>
                            )}
                            {noti?.createdAt && (
                                <span className="text-[11px] text-gray-500">
                                    {new Date(noti.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Post preview */}
            {noti?.post?.media && (
                <div className="flex-shrink-0 ml-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-600 shadow-md">
                        {noti.post.mediaType === "image" ? (
                            <img
                                src={noti.post.media}
                                alt="Post preview"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <video
                                src={noti.post.media}
                                muted
                                loop
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>
                </div>
            )}

            {/* Unread indicator */}
            {!noti?.isRead && (
                <div className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
        </div>
    )
}

export default NotificationCard;