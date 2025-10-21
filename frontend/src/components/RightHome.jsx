import { useSelector } from "react-redux";
import React from "react";
import { CgProfile } from "react-icons/cg";
import axios from "axios";
import { severUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import OtherUser from "./OtherUser";

function RightHome() {
    
    const { userData, suggestedUsers } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const handleLogOut = async () => {
        try {
            await axios.get(`${severUrl}/api/auth/signout`, { withCredentials: true });
            localStorage.removeItem("token");
            dispatch(setUserData(null));

        } catch (error) {
            console.error("Error logging out:", error);
        }
    };


    console.log("User data:", userData);

    return (
        <aside className="hidden lg:flex flex-col w-[320px] p-6 space-y-5">
            {/* Thông tin tài khoản */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    {userData?.profileImage ? (
                        <img
                            src={userData.profileImage}
                            alt="avatar"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    ) : (
                        <CgProfile size={40} />
                    )}

                    <div>
                        <div className='text-[16px] text-white font-semibold'>{userData?.username}</div>
                        <div className='text-[12px] text-gray-300 font-semibold'>{userData?.name}</div>
                    </div>
                </div>
                <button className="text-blue-400 text-sm font-semibold"
                    onClick={handleLogOut}>Log Out</button>
            </div>

            {/* Danh sách gợi ý */}
            <div className="w-full bg-[#121212] rounded-xl p-3">
                {/* Tiêu đề */}
                <div className="flex justify-between items-center text-xs mb-2">
                    <p className="text-gray-400">Suggested for you</p>
                    <button className="text-white font-semibold hover:underline">See All</button>
                </div>

                {/* Danh sách user */}
                <div className="flex flex-col space-y-1">
                    {suggestedUsers && suggestedUsers.slice(0, 5).map((user, index) => (
                        <OtherUser key={index} user={user} />
                    ))}
                </div>
            </div>  

            {/* Footer */}
            <footer className="text-[11px] text-gray-500 flex flex-wrap gap-2 mt-6">
                {[
                    "About",
                    "Help",
                    "Press",
                    "API",
                    "Jobs",
                    "Privacy",
                    "Terms",
                    "Locations",
                    "Language",
                ].map((item) => (
                    <span key={item}>{item}</span>
                ))}
            </footer>

            <p className="text-gray-500 text-xs mt-3">
                © 2025 INSTAGRAM FROM META
            </p>
        </aside >
    );
}

export default RightHome;
