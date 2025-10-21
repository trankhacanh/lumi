import React from "react";
import { FiHome, FiSearch, FiPlusSquare } from "react-icons/fi";
import { MdOutlineExplore, MdOutlineOndemandVideo } from "react-icons/md";
import { RiMessengerLine, RiHeartLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function LeftHome({ collapsed = false }) {
    const navigate = useNavigate();
    const { userData } = useSelector((state) => state.user);
    const { notificationData } = useSelector((state) => state.user);
    const [showNotification, setShowNotification] = React.useState(false);
    const navItems = [
        { icon: <FiHome size={26} />, label: "Home", onClick: () => navigate("/") },
        { icon: <FiSearch size={26} />, label: "Search", onClick: () => navigate("/search") },
        { icon: <MdOutlineExplore size={26} />, label: "Explore" },
        { icon: <MdOutlineOndemandVideo size={26} />, label: "Reels", onClick: () => navigate("/loops") },
        { icon: <RiMessengerLine size={26} />, label: "Messages", onClick: () => navigate("/messages") },
        {
            icon: (
                <div className="relative" onClick={() => navigate("/notifications")}>

                    <RiHeartLine size={26} />
                    {notificationData?.length > 0 && notificationData.some((noti) => noti.isRead === false) && <div className="w-[10px] h-[10px] bg-blue-600 rounded-full absolute top-0 right-0"></div>}

                </div>
            ),
            label: "Notifications",
            onClick: () => navigate("/notifications")
        },
        { icon: <FiPlusSquare size={26} />, label: "Create", onClick: () => navigate("/upload") },
        {
            icon: userData?.profileImage ? (
                <img
                    src={userData.profileImage}
                    alt="Profile"
                    className="w-7 h-7 rounded-full object-cover"
                />
            ) : (
                <CgProfile size={26} />
            ),
            label: "Profile",
            onClick: () => navigate(`/profile/${userData?.username}`),
        },
    ];

    return (
        <aside
            className={`hidden md:flex flex-col justify-between border-r border-gray-800 h-screen fixed left-0 top-0
            transition-all duration-300
            ${collapsed ? "w-[80px]" : "w-[280px]"} p-6`}
        >
            {/* Top Section */}
            <div className="flex flex-col">
                {/* Logo */}
                <div className="mb-10">
                    {!collapsed ? (
                        <h1
                            className="text-4xl font-[Billabong] cursor-pointer pl-3"
                            onClick={() => navigate("/")}
                        >
                            LUMI
                        </h1>
                    ) : (
                        <h1
                            className="text-4xl font-[Billabong] cursor-pointer text-center"
                            onClick={() => navigate("/")}
                        >
                            L
                        </h1>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex flex-col space-y-6">
                    {navItems.map((item, idx) => (
                        <button
                            key={idx}
                            onClick={item.onClick}
                            className={`flex items-center text-lg hover:text-gray-300 transition
                            ${collapsed ? "justify-center" : "space-x-4 pl-2"}`}
                        >
                            {item.icon}
                            {!collapsed && <span>{item.label}</span>}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Bottom Button */}
            <div className={`flex ${collapsed ? "justify-center" : "pl-2"}`}>
                <button className="flex items-center text-gray-400 hover:text-gray-300 text-lg">
                    {collapsed ? <span className="text-sm">•••</span> : <span>More</span>}
                </button>
            </div>
        </aside>
    );
}

export default LeftHome;
