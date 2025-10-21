import React from 'react';
import { CgProfile } from 'react-icons/cg';
import { FiPlusCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from "axios";
import { severUrl } from "../App";

function StoryDp({ ProfileImage, userName, story }) {
    const navigate = useNavigate();
    const { userData } = useSelector((state) => state.user);

    const hasStory = Array.isArray(story) && story.length > 0;
    const handleViewers = async () => {
        try {
            const res = await axios.get(`${severUrl}/api/story/view/${story._id}`, { withCredentials: true });
            console.log("Viewers:", res.data);
        } catch (err) {
            console.error("Error fetching viewers:", err);
        }
    };
    const handleClick = () => {
        if (userName === "Your Story" && !hasStory) {
            navigate("/upload");
        } else if (userName === "Your Story" && hasStory) {
            handleViewers();
            navigate(`/story/${userData.username}`);
            console.log("Mở story của:", userName);
        } else {
            handleViewers();
            navigate(`/story/${userName}`);
        }

    };


    return (
        <div className="flex flex-col w-[80px] items-center">
            <div
                onClick={handleClick}
                className={`w-[80px] h-[80px] rounded-full flex justify-center items-center relative cursor-pointer ${hasStory
                    ? "bg-gradient-to-b from-blue-500 to-blue-950"
                    : "bg-transparent"
                    }`}
            >
                <div className="w-[74px] h-[74px] bg-black rounded-full flex justify-center items-center overflow-hidden">
                    {ProfileImage ? (
                        <img
                            src={ProfileImage}
                            alt="avatar"
                            className="w-[70px] h-[70px] rounded-full object-cover"
                        />
                    ) : (
                        <CgProfile size={40} className="text-white" />
                    )}
                    {userName === "Your Story" && !hasStory && (
                        <FiPlusCircle
                            size={22}
                            className="absolute bottom-0 right-0 text-blue-500 bg-white rounded-full"
                        />
                    )}
                </div>
            </div>

            <div className="text-[14px] text-center truncate w-full text-white mt-1">
                {userName}
            </div>
        </div>
    );
}

export default StoryDp;
