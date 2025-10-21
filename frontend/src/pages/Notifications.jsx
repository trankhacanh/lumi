import React from "react";
import LeftHome from "../components/LeftHome";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import NotificationCard from "../components/NotificationCard";
import axios from "axios";
import { severUrl } from "../App";
import { useEffect } from "react";
import getAllNotifications from "../hooks/getAllNotifications";
import { setNotificationData } from "../redux/userSlice";

function Notifications() {
    const navigate = useNavigate();
    const { notificationData } = useSelector(state => state.user)
    const ids = notificationData.map((n) => n.id)
    const dispatch = useDispatch();
    const markAsRead = async () => {
        try {
            const result = await axios.post(`${severUrl}/api/user/markAsRead`, { notificationId: ids }, { withCredentials: true });
            await fetchNotifications();
        } catch (error) {
            console.log(error)
        }
    }


    const fetchNotifications = async () => {
        try {
            const res = await axios.get(`${severUrl}/api/user/getAllNotifications`, {
                withCredentials: true,
            });
            dispatch(setNotificationData(res.data));
        } catch (err) {
            console.error("Error fetching current user:", err);
        }
    }

    useEffect(() => {
        markAsRead();


    }, [])
    return (
        <div className="w-full min-h-[100vh] bg-black text-white flex">
            {/* LeftHome - Sidebar bên trái */}
            <div className="fixed left-0 top-0 h-full">
                <LeftHome />
            </div>

            {/* Notification Content - Căn giữa */}
            <div className="flex-1 flex justify-center ml-[300px]"> {/* Adjust margin based on your LeftHome width */}
                <div className="w-full max-w-[600px] flex flex-col gap-[20px] py-[20px] px-[10px]">
                    <h1 className="text-2xl font-bold mb-4">Notifications</h1>
                    {notificationData?.length > 0 ? (
                        notificationData.map((noti, index) => (
                            <NotificationCard noti={noti} key={index} />
                        ))
                    ) : (
                        <div className="text-center text-gray-500 mt-10">
                            No notifications yet
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Notifications;