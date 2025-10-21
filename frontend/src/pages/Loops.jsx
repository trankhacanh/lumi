import React from "react";
import { useNavigate } from "react-router-dom";
import LeftHome from "../components/LeftHome";
import { useSelector } from "react-redux";
import LoopCard from "../components/LoopCard";
import useGetAllLoops from "../hooks/getAllLoops";

function Loops() {
    const navigate = useNavigate();
    const { loopData } = useSelector((state) => state.loop);

    useGetAllLoops(); // ✅ Gọi hook để fetch dữ liệu

    return (
        <div className="w-screen h-screen bg-black overflow-hidden flex justify-center items-center text-white">
            <LeftHome />
            {/* ⚠️ sửa lỗi chính tả scroll */}
            <div className="h-[100vh] overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
                {loopData && loopData.length > 0 ? (
                    loopData.map((loop, index) => (
                        <div key={loop._id || index} className="h-screen snap-start">
                            <LoopCard loop={loop} />
                        </div>
                    ))
                ) : (
                    <div className="text-gray-500 text-center mt-20">
                        Không có loop nào được tìm thấy 😢
                    </div>
                )}
            </div>
        </div>
    );
}

export default Loops;
