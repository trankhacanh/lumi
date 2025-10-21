import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { severUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setProfileData } from "../redux/userSlice";
import { FaPlus } from "react-icons/fa";
import { BsGrid3X3, BsBookmark, BsPersonSquare } from "react-icons/bs";
import LeftHome from "../components/LeftHome";
import Nav from "../components/Nav";
import dp from "../assets/dp.jpg";

import { useNavigate } from "react-router-dom";
import FollowButton from "../components/FollowButton";
import { setSelectedUser } from "../redux/mesageSlice";

function Profile() {
    const navigate = useNavigate();
    const { userName } = useParams();
    const dispatch = useDispatch();
    const { profileData, userData } = useSelector((state) => state.user);

    const handleProfile = async () => {
        try {
            const result = await axios.get(`${severUrl}/api/user/getProfile/${userName}`, {
                withCredentials: true,
            });
            dispatch(setProfileData(result.data));
        } catch (error) {
            console.error("Error fetching profile data:", error);
        }
    };

    useEffect(() => {
        handleProfile();
    }, [userName, dispatch]);

    return (
        <div className="flex flex-col items-center bg-black min-h-screen text-white pt-8">
            <LeftHome />

            {/* --- Header Profile Info --- */}
            <div className="flex flex-col md:flex-row md:items-center md:space-x-16 mt-10 w-full max-w-4xl px-4">
                {/* Avatar */}
                <div className="flex justify-center md:justify-start w-full md:w-auto">
                    <img
                        src={profileData?.profileImage || dp}
                        alt=""
                        className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full object-cover border-2 border-gray-700"
                    />
                </div>

                {/* User info */}
                <div className="flex flex-col items-center md:items-start mt-6 md:mt-0 space-y-3 w-full md:w-auto">
                    {/* Username + Buttons */}
                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                        <h2 className="text-lg sm:text-xl font-semibold">{profileData?.username}</h2>
                        <div className="flex gap-2">
                            {profileData?._id === userData?._id ? (
                                <>
                                    <button className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm font-medium"
                                        onClick={() => navigate("/editprofile")}
                                    >
                                        Edit profile
                                    </button>
                                    <button className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm font-medium">
                                        View archive
                                    </button>
                                </>
                            ) : (
                                <>

                                    <FollowButton tailwind={"bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-sm font-medium text-white"} targetUserId={profileData?._id} />
                                    <button className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm font-medium text-white"
                                        onClick={() => {
                                            dispatch(setSelectedUser(profileData));
                                            navigate("/messageArea");
                                        }}
                                    >
                                        Message
                                    </button>
                                </>
                            )}
                        </div>

                    </div>

                    {/* Stats */}
                    <div className="flex justify-center md:justify-start space-x-8 mt-2">
                        <div className="flex flex-col items-center md:items-start">
                            <span className="font-semibold">{profileData?.posts.length}</span>
                            <span className="text-sm text-gray-400">posts</span>
                        </div>
                        <div className="flex flex-col items-center md:items-start">
                            <span className="font-semibold">{profileData?.followers.length}</span>
                            <span className="text-sm text-gray-400">followers</span>
                        </div>
                        <div className="flex flex-col items-center md:items-start">
                            <span className="font-semibold">{profileData?.following.length}</span>
                            <span className="text-sm text-gray-400">following</span>
                        </div>
                    </div>

                    {/* Full name */}
                    <h3 className="font-semibold mt-3">{profileData?.name}</h3>
                    <p className="text-gray-400 text-sm">{profileData?.bio || "new user"}</p>
                </div>
            </div>

            {/* --- Add story button --- */}
            <div className="mt-10 flex flex-col items-center space-y-2">
                <button className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-gray-600 hover:bg-gray-800">
                    <FaPlus className="text-lg sm:text-xl" />
                </button>
                <p className="text-xs text-gray-400">New</p>
            </div>

            {/* --- Tabs Section --- */}
            <div className="w-full flex justify-center mt-10">
                <div className="w-[300px] sm:w-[400px] md:w-[600px] lg:w-[700px] border-t border-gray-800 flex justify-center">
                    <div className="flex space-x-8 sm:space-x-12 md:space-x-[60px] lg:space-x-[150px] py-3 overflow-x-auto">
                        <button className="flex items-center space-x-1 text-gray-300 border-t-2 border-white pt-1">
                            <BsGrid3X3 className="text-base sm:text-lg" />
                            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider">
                                Posts
                            </span>
                        </button>

                        <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-300 pt-1">
                            <BsBookmark className="text-base sm:text-lg" />
                            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider">
                                Saved
                            </span>
                        </button>

                        <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-300 pt-1">
                            <BsPersonSquare className="text-base sm:text-lg" />
                            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider">
                                Tagged
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* --- Empty Posts Section --- */}
            <div className="flex flex-col items-center mt-20 px-4 text-center">
                <div className="border-2 border-gray-600 rounded-full p-6 sm:p-8">
                    <BsGrid3X3 className="text-3xl sm:text-4xl text-gray-400" />
                </div>
                <h3 className="mt-6 text-lg sm:text-xl font-semibold">Share Photos</h3>
                <p className="text-sm sm:text-base text-gray-400 mt-2 max-w-sm">
                    When you share photos, they will appear on your profile.
                </p>
                <button className="mt-4 text-blue-400 font-medium hover:underline">
                    Share your first photo
                </button>
            </div>

            {/* --- Footer --- */}
            <footer className="text-[11px] sm:text-[12px] text-gray-500 mt-20 mb-8 text-center space-x-2">
                <span>Meta</span> · <span>About</span> · <span>Blog</span> · <span>Help</span> ·{" "}
                <span>API</span> · <span>Privacy</span> · <span>Terms</span> · <span>Jobs</span>
                <div className="mt-2">© 2025 LUMI FROM META</div>
            </footer>
            <Nav />
        </div>
    );
}

export default Profile;
