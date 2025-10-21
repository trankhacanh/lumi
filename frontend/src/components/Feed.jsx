import React, { use } from 'react'
import logo from "../assets/logo.png"
import { FaRegHeart } from "react-icons/fa6";
import StoryDp from "./StoryDp";
import Nav from './Nav';
import { useSelector } from 'react-redux';
import Post from './Post';
function Feed() {
    const { postData } = useSelector((state) => state.post);
    const { userData } = useSelector((state) => state.user);
    const { storyList, currentUserStory } = useSelector((state) => state.story);
    return (
        <div className='lg:w-[50%] w-full bg-black min-h-[100vh] lg:h-[100vh] relative lg:overflow-y-auto overflow-x-hidden '>
            <div className='w-full h-[100px] flex items-center 
            justify-between p-[20px] lg:hidden'>
                <img src={logo} alt="" className='w-[80px]' />
                <div>
                    <FaRegHeart className='text-[white] w-[25px] h-[25px]' />
                </div>
            </div>
            <div className='w-full overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing'>
                <div className='flex flex-nowrap gap-[10px] items-center p-[20px]'>
                    <StoryDp userName={"Your Story"} ProfileImage={userData.profileImage} story={currentUserStory} />
                    {storyList?.map((story, index) => (
                        <StoryDp userName={story.author.username} ProfileImage={story.author.profileImage} story={story} key={index} />
                    ))}


                </div>
            </div>

            <div className='w-full min-h-[100vh] flex flex-col items-center gap-[20px] p-[10px] pt-[40px] bg-black  relative pb-[120px]'>
                <Nav />
                {postData?.map((post, index) => (
                    <Post post={post} key={index} />
                ))}
            </div>
        </div>
    )
}

export default Feed