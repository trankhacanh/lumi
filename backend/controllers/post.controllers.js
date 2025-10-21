import uploadOnCloudinary from "../config/cloudinary.js"
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { getSocketId, io } from "../socket.js";
import Notification from "../models/notification.model.js"
export const uploadPost = async (req, res) => {
    try {
        const { caption, mediaType } = req.body;
        let media;
        if (req.file) {
            media = await uploadOnCloudinary(req.file.path);
        } else {
            return res.status(400).json({ message: "media is required" });
        }
        const post = await Post.create({
            caption, media, mediaType, author: req.userId
        })
        const user = await User.findById(req.userId);
        user.posts.push(post._id);
        await user.save();

        const populatedPost = await Post.findById(post._id).populate("author", "name username profileImage")
        return res.status(201).json(populatedPost);
    } catch (error) {
        console.error("Error uploading post:", error);
        return res.status(500).json({ message: "uploadPost error" });
    }
}

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate("author", "name username profileImage").sort({ createdAt: -1 });
        return res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        return res.status(500).json({ message: "getAllPosts error" });
    }
}
export const like = async (req, res) => {
    try {
        const postId = req.params.postId;
        //const userId = req.userId;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const alreadyLiked = post.likes.some(id => id.toString() == req.userId.toString());
        if (alreadyLiked) {
            post.likes = post.likes.filter(id => id.toString() != req.userId.toString());
        } else {
            post.likes.push(req.userId);
            if (post.author._id != req.userId) {
                const notification = await Notification.create({
                    sender: req.userId,
                    receiver: post.author._id,
                    type: "like",
                    post: post._id,
                    message: "liked your post"
                })
                const populatedNotification = await Notification.findById(notification._id).
                    populate("sender receiver post");
                const receiverSocketId = getSocketId(post.author._id)
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("newNotification", populatedNotification)
                }
            }
        }
        io.emit("likedPost", {
            postId: post._id,
            likes: post.likes
        })
        await post.save();
        await post.populate("author", "name username profileImage");
        return res.status(200).json({ message: alreadyLiked ? "Post unliked" : "Post liked", likesCount: post.likes.length });
    }
    catch (error) {
        console.error("Error liking post:", error);
        return res.status(500).json({ message: "like error" });
    }
}

export const comment = async (req, res) => {
    try {
        const { message } = req.body;
        const postId = req.params.postId;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        post.comments.push({ author: req.userId, message });
        if (post.author._id != req.userId) {
            const notification = await Notification.create({
                sender: req.userId,
                receiver: post.author._id,
                type: "comment",
                post: post._id,
                message: "commented on your post"
            })
            const populatedNotification = await Notification.findById(notification._id).
                populate("sender receiver post");
            const receiverSocketId = getSocketId(post.author._id)
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newNotification", populatedNotification)
            }
        }
        await post.save();
        await post.populate("author", "name username profileImage");
        await post.populate("comments.author");
        io.emit("commentedPost", {
            postId: post._id,
            comments: post.comments
        })
        return res.status(200).json({ message: "Comment added", comments: post.comments });

    } catch (error) {
        console.error("Error commenting on post:", error);
        return res.status(500).json({ message: "comment error" });
    }
}

export const saved = async (req, res) => {
    try {
        const postId = req.params.postId;
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const alreadySaved = user.saved.some(id => id.toString() == postId.toString());
        if (alreadySaved) {
            user.saved = user.saved.filter(id => id.toString() != postId.toString());
        } else {
            user.saved.push(postId);
        }
        await user.save();
        user.populate("saved");
        return res.status(200).json(user);
    }
    catch (error) {
        console.error("Error liking post:", error);
        return res.status(500).json({ message: "like error" });
    }
}