import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { severUrl } from "../App";
import { setPostData } from "../redux/postSlice";
import { useSelector } from "react-redux";
import { setNotificationData } from "../redux/userSlice";

function getAllNotifications() {
    const dispatch = useDispatch();
    const { userData } = useSelector((state) => state.user);
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await axios.get(`${severUrl}/api/user/getAllNotifications`, {
                    withCredentials: true,
                });
                dispatch(setNotificationData(res.data));
            } catch (err) {
                console.error("Error fetching current user:", err);
            }
        };

        fetchNotifications();
    }, [dispatch, userData]);
}

export default getAllNotifications;
