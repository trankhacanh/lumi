import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setFollowing, setUserData } from "../redux/userSlice";
import { severUrl } from "../App";
import { useSelector } from "react-redux";

function getFollowingList() {
    const dispatch = useDispatch();
    const { storyData } = useSelector((state) => state.story);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${severUrl}/api/user/followingList`, {
                    withCredentials: true,
                });

                dispatch(setFollowing(res.data));

            } catch (err) {
                console.error("Error fetching current user:", err);
            }
        };

        fetchUser();
    }, [storyData]);
}

export default getFollowingList;
