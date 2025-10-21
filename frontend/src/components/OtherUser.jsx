import React from 'react';
import { CgProfile } from 'react-icons/cg';
import { useNavigate } from 'react-router-dom';
import FollowButton from './FollowButton';

function OtherUser({ user }) {
    const navigate = useNavigate();
    return (
        <div className="w-full h-[55px] flex items-center justify-between border-b border-gray-800 px-1">
            <div className="flex items-center space-x-2 "
                onClick={() => navigate(`/profile/${user.username}`)}
            >
                {user?.profileImage ? (
                    <img
                        src={user.profileImage}
                        alt="avatar"
                        className="w-8 h-8 rounded-full object-cover"
                    />
                ) : (
                    <CgProfile size={32} className="text-gray-400" />
                )}

                <div>
                    <div className="text-[13px] text-white font-semibold leading-tight">
                        {user?.username}
                    </div>
                    <div className="text-[11px] text-gray-400">{user?.name}</div>
                </div>
            </div>
            <FollowButton tailwind={"text-[11px] text-blue-400 font-semibold hover:text-blue-300"} targetUserId={user._id} />

        </div>
    );
}

export default OtherUser;
