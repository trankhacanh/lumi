import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { severUrl } from "../App";
import { useSelector } from "react-redux";
import { setStoryList } from "../redux/storySlice";

function getAllStories() {
    const dispatch = useDispatch();
    const { userData } = useSelector((state) => state.user);
    const { storyData } = useSelector((state) => state.story)
    useEffect(() => {
        const fetchStory = async () => {
            try {
                const res = await axios.get(`${severUrl}/api/story/getAll`, {
                    withCredentials: true, // gửi cookie HttpOnly sang server
                });
                dispatch(setStoryList(res.data));
                console.log("API Response:", res.data);
            } catch (err) {
                console.error("Error fetching current user:", err);
            }
        };

        fetchStory();
    }, [userData, storyData]);
}

export default getAllStories;
