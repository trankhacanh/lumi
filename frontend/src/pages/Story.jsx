import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { severUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setStoryData } from "../redux/storySlice";
import StoryCard from "../components/StoryCard";
import LeftHome from "../components/LeftHome";
function Story() {
    const { userName } = useParams(); // ✅ Lấy từ URL
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { storyData } = useSelector((state) => state.story);


    const handleStory = async () => {
        dispatch(setStoryData(null));
        try {
            setIsLoading(true);
            setError(null);

            if (!userName) {
                throw new Error("No username provided");
            }

    
            const result = await axios.get(
                `${severUrl}/api/story/getByUserName/${userName}`,
                { withCredentials: true }
            );

            dispatch(setStoryData(result.data[0]));
        } catch (err) {
            console.error("Error fetching story data:", err);
            setError(err.message);
            if (err.response?.status === 404) {
                navigate("/");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (userName) {
            handleStory();
        } else {
            setIsLoading(false);
            setError("Không tìm thấy username!");
        }
    }, [userName]);

    if (error) {
        return (
            <div className="w-full h-[100vh] bg-black flex justify-center items-center text-white">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="w-full h-[100vh] bg-black flex justify-center items-center text-white">
            <LeftHome />
            {isLoading ? (
                <div className="text-white">Loading...</div>
            ) : (
                storyData && <StoryCard storyData={storyData} />
            )}
        </div>
    );
}

export default Story;
