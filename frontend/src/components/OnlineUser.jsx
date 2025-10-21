import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import dp from "../assets/dp.jpg";
import { setSelectedUser } from "../redux/mesageSlice";

function OnlineUser({ user }) {
    const navigate = useNavigate();

    const dispatch = useDispatch();
    return (
        <div className="w-[60px] h-[60px] flex gap-[20px] justify-start items-center relative">
            <div className="w-[40px] h-[40px] border-2 border-black rounder-full cursor-pointer overflow-hidden"
                onClick={() => {
                    dispatch(setSelectedUser(user))
                    navigate(`/message`);
                }}>
                <img src={user.profileImage || dp} alt="avatar" className="w-full  object-cover" />

            </div>

        </div>
    );
}

export default OnlineUser;
