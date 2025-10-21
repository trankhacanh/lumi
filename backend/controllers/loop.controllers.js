import Loop from "../models/loop.model.js";
import User from "../models/user.model.js";
import uploadOnCloudinary from "../config/cloudinary.js"

import { getSocketId, io } from "../socket.js";
import Notification from "../models/notification.model.js"
export const uploadloop = async (req, res) => {
    try {
        const { caption } = req.body;
        let media;
        if (req.file) {
            media = await uploadOnCloudinary(req.file.path);
        } else {
            return res.status(400).json({ message: "media is required" });
        }
        const loop = await Loop.create({
            caption, media, author: req.userId
        })
        const user = await User.findById(req.userId);
        user.loops.push(loop._id);
        await user.save();

        const populatedLoop = await Loop.findById(loop._id).populate("author", "name username profileImage")
        return res.status(201).json(populatedLoop);
    } catch (error) {
        console.error("Error uploading post:", error);
        return res.status(500).json({ message: "uploadloop error" });
    }
}


export const like = async (req, res) => {
    try {
        const { loopId } = req.params;
        const userId = req.userId;

        console.log('Like request - loopId:', loopId, 'userId:', userId);

        // Validate input
        if (!loopId) {
            return res.status(400).json({ message: "Loop ID is required" });
        }

        // Find loop and populate author
        const loop = await Loop.findById(loopId).populate("author", "name username profileImage _id");
        if (!loop) {
            return res.status(404).json({ message: "Loop not found" });
        }

        // Check if user already liked
        const alreadyLiked = loop.likes.some(
            (id) => id.toString() === userId.toString()
        );

        if (alreadyLiked) {
            // Unlike
            loop.likes = loop.likes.filter(
                (id) => id.toString() !== userId.toString()
            );
        } else {
            // Like
            loop.likes.push(userId);

            // Create notification if liking someone else's post
            if (loop.author._id.toString() !== userId.toString()) {
                try {
                    const notification = await Notification.create({
                        sender: userId,
                        receiver: loop.author._id,
                        type: "like",
                        loop: loop._id,
                        message: "liked your loop"
                    });

                    const populatedNotification = await Notification.findById(notification._id)
                        .populate("sender", "name username profileImage")
                        .populate("receiver", "name username profileImage")
                        .populate("loop", "media caption");

                    const receiverSocketId = getSocketId(loop.author._id.toString());
                    if (receiverSocketId) {
                        io.to(receiverSocketId).emit("newNotification", populatedNotification);
                    }
                } catch (notifError) {
                    console.error("Notification creation error:", notifError);
                    // Continue with like even if notification fails
                }
            }
        }

        await loop.save();

        // Emit socket event
        try {
            io.emit("likedLoop", {
                loopId: loop._id,
                likes: loop.likes,
                likesCount: loop.likes.length
            });
        } catch (socketError) {
            console.error("Socket emit error:", socketError);
        }

        console.log("✅ Like operation successful - isLiked:", !alreadyLiked, "Likes count:", loop.likes.length);

        return res.status(200).json({
            success: true,
            message: alreadyLiked ? "Loop unliked" : "Loop liked",
            isLiked: !alreadyLiked,
            likesCount: loop.likes.length,
            loop: {
                _id: loop._id,
                likes: loop.likes,
                author: loop.author
            },
        });
    } catch (error) {
        console.error("🔥 Error liking loop:", error);
        return res.status(500).json({
            success: false,
            message: "Like error",
            error: error.message
        });
    }
};

export const comment = async (req, res) => {
    try {
        const { message } = req.body;
        const loopId = req.params.loopId;
        const loop = await Loop.findById(loopId);
        if (!loop) {
            return res.status(404).json({ message: "Post not found" });
        }
        loop.comments.push({ author: req.userId, message });
        if (loop.author._id != req.userId) {
            const notification = await Notification.create({
                sender: req.userId,
                receiver: loop.author._id,
                type: "comment",
                loop: loop._id,
                message: "commented your loop"
            })
            const populatedNotification = await Notification.findById(notification._id).
                populate("sender receiver loop");
            const receiverSocketId = getSocketId(loop.author._id)
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newNotification", populatedNotification)
            }
        }
        await loop.save();
        await loop.populate("author", "name username profileImage");
        await loop.populate("comments.author");
        io.emit("CommentedLoop", {
            loopId: loop._id,
            comments: loop.comments
        })
        return res.status(200).json({ message: "Comment added", comments: loop.comments });

    } catch (error) {
        console.error("Error commenting on post:", error);
        return res.status(500).json({ message: "comment error" });
    }
}


export const getAllLoops = async (req, res) => {
    try {
        const loops = await Loop.find().populate("author", "name username profileImage").populate("comments.author");
        return res.status(200).json(loops);
    } catch (error) {
        console.error("Error fetching posts:", error);
        return res.status(500).json({ message: "getAllLoops error" });
    }
}
