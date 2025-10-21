import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LeftHome from "../components/LeftHome";
import { FiSearch } from "react-icons/fi";
import axios from "axios";
import { severUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setSearchData } from "../redux/userSlice";

function Search() {
    const [input, setInput] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { searchData } = useSelector((state) => state.user);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();

        // Clear search results nếu input trống
        if (!input.trim()) {
            dispatch(setSearchData([]));
            return;
        }

        try {
            const result = await axios.get(`${severUrl}/api/user/search?keyWord=${input}`, {
                withCredentials: true,
            });
            console.log("Search results:", result.data);
            dispatch(setSearchData(result.data));
        } catch (err) {
            console.error("Error searching users:", err);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            handleSearch();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [input]);

    // Clear search results khi component unmount (tùy chọn)
    useEffect(() => {
        return () => {
            dispatch(setSearchData([]));
        };
    }, []);

    return (
        <div className="w-full min-h-[100vh] bg-black flex items-center flex-col gap-[20px] text-white ">
            <LeftHome />
            <div className="w-full h-[80px] flex items-center justify-center">
                <form
                    className="w-[90%] max-w-[800px] h-[80%] rounded-full bg-[#0f1414] flex items-center px-[20px]"
                    onSubmit={handleSearch}
                >
                    <FiSearch className="w-[18px] h-[18px] text-white" />
                    <input
                        type="text"
                        placeholder="search..."
                        className="w-full h-full outline-0 rounded-full px-[20px] text-white text-[18px] bg-transparent"
                        onChange={(e) => setInput(e.target.value)}
                        value={input}
                    />
                </form>
            </div>

            {/* Hiển thị kết quả tìm kiếm */}
            {searchData?.map((user) => (
                <div
                    key={user.id}
                    className='w-[90vw] max-w-[700px] h-[80px] rounded-full bg-white flex items-center gap-[20px] px-[20px] hover:bg-gray-100 transition-colors cursor-pointer'
                    onClick={() => navigate(`/profile/${user.userName}`)}
                >
                    <div className='w-[40px] h-[40px] border-2 border-black rounded-full overflow-hidden'>
                        <img
                            src={user.profileImage || "/default-avatar.png"}
                            alt={user.userName}
                            className='w-full h-full object-cover'
                        />
                    </div>
                    <div className='text-black text-[18px] font-semibold'>
                        <div>{user.userName}</div>
                        <div className='text-[14px] text-gray-400'>{user.name}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Search;