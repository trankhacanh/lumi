import React from "react";
import { FiPlusSquare, FiSearch } from "react-icons/fi";
import { GoHomeFill } from "react-icons/go";
import { RxVideo } from "react-icons/rx";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Nav() {
    const navigate = useNavigate();
    const { userData } = useSelector((state) => state.user);

    return (
        <div
            className="fixed bottom-4 left-1/2 -translate-x-1/2
                 w-[90%] max-w-[500px] h-[70px]
                 bg-black/90 backdrop-blur-md
                 flex justify-around items-center
                 rounded-full border border-gray-700
                 shadow-lg shadow-black/60
                 text-white text-2xl
                 lg:hidden z-50 transition-all duration-300"
        >
            <button onClick={() => navigate("/")} className="hover:text-gray-400 cursor-pointer transition-colors duration-200">
                <GoHomeFill />
            </button>

            <button className="hover:text-gray-400 cursor-pointer transition-colors duration-200">
                <FiSearch />
            </button>

            <button className="hover:text-gray-400 cursor-pointer transition-colors duration-200">
                <RxVideo />
            </button>

            <button
                onClick={() => navigate(`/profile/${userData?.username}`)}
                className="hover:text-gray-400 transition-colors duration-200"
            >
                <CgProfile />
            </button>

            <button onClick={() => navigate("/upload")} className="hover:text-gray-400 transition-colors duration-200">
                <FiPlusSquare />
            </button>
        </div>
    );
}

export default Nav;
