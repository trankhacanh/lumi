import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setFollowing, setUserData } from "../redux/userSlice";
import { severUrl } from "../App";
import { useSelector } from "react-redux";
import { setCurrentUserStory } from "../redux/storySlice";
function useCurrentUser() {
    const dispatch = useDispatch();
    const { storyData } = useSelector((state) => state.story);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${severUrl}/api/user/current`, {
                    withCredentials: true, // gửi cookie HttpOnly sang server
                });
                dispatch(setUserData(res.data));

                dispatch(setCurrentUserStory(res.data.story));
            } catch (err) {
                console.error("Error fetching current user:", err);
            }
        };

        fetchUser();
    }, [storyData]);
}

export default useCurrentUser;
