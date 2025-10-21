import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LeftHome from "../components/LeftHome";
import dp from "../assets/dp.jpg";
import Nav from "../components/Nav";
import { severUrl } from "../App";
import { setProfileData, setUserData } from "../redux/userSlice";
import { ClipLoader } from "react-spinners";
import axios from "axios";

function EditProfile() {
    const { userData } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const imageInput = useRef();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState(userData.name || "");
    const [userName, setUserName] = useState(userData.username || "");
    const [bio, setBio] = useState(userData.bio || "");
    const [profession, setProfession] = useState(userData.profession || "");
    const [gender, setGender] = useState(userData.gender || "");

    const [frontendImage, setFrontendImage] = useState(userData.profileImage || dp);
    const [backendImage, setBackendImage] = useState(null);

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBackendImage(file);
            setFrontendImage(URL.createObjectURL(file));
        }
    };

    const handleEditProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formdata = new FormData();
            formdata.append("name", name);
            formdata.append("username", userName);
            formdata.append("bio", bio);
            formdata.append("profession", profession);
            formdata.append("gender", gender);
            if (backendImage) formdata.append("profileImage", backendImage);

            const result = await axios.post(`${severUrl}/api/user/editProfile`, formdata, {
                withCredentials: true,
            });

            dispatch(setProfileData(result.data));
            dispatch(setUserData(result.data));
            setLoading(false);
            navigate(`/profile/${userName}`);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center bg-black min-h-screen text-white relative pt-8">
            <LeftHome />

            <form
                onSubmit={handleEditProfile}
                className="flex flex-col items-center mt-10 w-[90%] sm:w-[400px] space-y-4"
            >
                {/* Ảnh đại diện */}
                <div
                    className="flex flex-col items-center space-y-2 cursor-pointer"
                    onClick={() => imageInput.current.click()}
                >
                    <input
                        type="file"
                        accept="image/*"
                        ref={imageInput}
                        hidden
                        onChange={handleImage}
                    />
                    <img
                        src={frontendImage || dp}
                        alt="profile"
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-gray-600"
                    />
                    <span className="text-blue-500 hover:text-blue-400 text-sm">
                        Change Your Profile Picture
                    </span>
                </div>

                {/* Input fields */}
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter Your Name"
                    className="w-full bg-gray-900 text-white px-4 py-2 rounded-xl outline-none border border-gray-700 focus:border-gray-500"
                />

                <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter Your Username"
                    className="w-full bg-gray-900 text-white px-4 py-2 rounded-xl outline-none border border-gray-700 focus:border-gray-500"
                />

                <input
                    type="text"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Bio"
                    className="w-full bg-gray-900 text-white px-4 py-2 rounded-xl outline-none border border-gray-700 focus:border-gray-500"
                />

                <input
                    type="text"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    placeholder="Profession"
                    className="w-full bg-gray-900 text-white px-4 py-2 rounded-xl outline-none border border-gray-700 focus:border-gray-500"
                />

                <input
                    type="text"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    placeholder="Gender"
                    className="w-full bg-gray-900 text-white px-4 py-2 rounded-xl outline-none border border-gray-700 focus:border-gray-500"
                />

                <button
                    type="submit"
                    className="w-full bg-gray-300 text-black font-medium py-2 rounded-full hover:bg-gray-400 transition"
                >
                    {loading ? <ClipLoader size={30} color="black" /> : "Save Profile"}
                </button>
            </form>

            <Nav />
        </div>
    );
}

export default EditProfile;
