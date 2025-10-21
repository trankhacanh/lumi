
import React from "react";
import LeftHome from "../components/LeftHome";
import RightHome from "../components/RightHome";
import { BsThreeDots } from "react-icons/bs";
import Feed from "../components/Feed";

function Home() {
    return (
        <div className="bg-black text-white min-h-screen flex justify-center">
            <LeftHome />
            <Feed />
            <RightHome />
        </div>
    );
}

export default Home;

