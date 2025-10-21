import axios from "axios";
import React from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { severUrl } from "../App";
import { toggleFollow } from "../redux/userSlice";
function FollowButton({ targetUserId, tailwind }) {
    const { following } = useSelector((state) => state.user);
    const isFollowing = following?.includes(targetUserId);
    const dispatch = useDispatch();
    const handleFollow = async () => {
        try {
            const result = await axios.get(`${severUrl}/api/user/follow/${targetUserId}`, { withCredentials: true });
            dispatch(toggleFollow(targetUserId));
        }

        catch (err) {
            console.error("Error following/unfollowing the user:", err);
        }
    };

    return (
        <button className={tailwind} onClick={handleFollow}>
            {isFollowing ? "Following" : "Follow"}
        </button>
    );
}
export default FollowButton;