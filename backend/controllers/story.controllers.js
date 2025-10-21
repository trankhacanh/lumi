
import User from '../models/user.model.js';
import Story from '../models/story.model.js';
import uploadOnCloudinary from "../config/cloudinary.js"

export const uploadStory = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (user.story) {
            await Story.findByIdAndDelete(user.story);
            user.story = null;
        }
        const { mediaType } = req.body;
        let media;
        if (req.file) {
            media = await uploadOnCloudinary(req.file.path);
        } else {
            return res.status(400).json({ message: "media is required" });
        }
        const story = await Story.create({
            author: req.userId, mediaType, media
        });
        user.story = story._id;
        await user.save();
        const populatedStory = await Story.findById(story._id).populate("author", "name username profileImage").populate("viewers", "name username profileImage");
        return res.status(201).json(populatedStory);
    }
    catch (error) {
        console.error("Error uploading story:", error);
        return res.status(500).json({ message: "uploadStory error" });
    }
}
export const viewStory = async (req, res) => {
    try {
        const storyId = req.params.storyId;
        const story = await Story.findById(storyId);
        if (!story) {
            return res.status(404).json({ message: "Story not found" });
        }
        const viewersIds = story.viewers.map(id => id.toString());
        if (!viewersIds.includes(req.userId.toString())) {
            story.viewers.push(req.userId);
            await story.save();
        }
        const populatedStory = await Story.findById(story._id).populate("author", "name username profileImage").populate("viewers", "name username profileImage");
        return res.status(200).json(populatedStory);

    }
    catch (error) {
        console.error("Error viewing story:", error);
        return res.status(500).json({ message: "viewStory error" });
    }
}
export const getStoryByUserName = async (req, res) => {
    try {



        const userName = req.params.userName || req.params.username;


        if (!userName) {

            return res.status(400).json({ message: "Missing username parameter" });
        }

        // 🧠 Kiểm tra trong DB
        const user = await User.findOne({ username: userName.trim() });
        if (!user) {

            return res.status(404).json({ message: "User not found" });
        }

        // 🔍 Lấy story của user
        const story = await Story.find({ author: user._id }).populate("viewers author");


        return res.status(200).json(story);
    } catch (error) {

        return res.status(500).json({ message: "getStoryByUserName error" });
    }
};


export const getAllStories = async (req, res) => {
    try {
        const currentUser = await User.findById(req.userId);
        const followingIds = currentUser.following;
        const stories = await Story.find({ author: { $in: followingIds } })
            .populate("viewers author")

            .sort({ createdAt: -1 });
        return res.status(200).json(stories);
    }
    catch (error) {
        console.error("Error getting all stories:", error);
        return res.status(500).json({ message: "getAllStories error" });
    }
}