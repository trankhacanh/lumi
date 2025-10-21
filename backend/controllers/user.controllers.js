import User from "../models/user.model.js";
import uploadOnCloudinary from "../config/cloudinary.js"
import Notification from "../models/notification.model.js"
export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).populate("posts loops posts.author posts.comments story following");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const suggestedUsers = async (req, res) => {
    try {
        const users = await User.find({
            _id: { $ne: req.userId }
        }).select("-password");
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const editProfile = async (req, res) => {
    try {
        console.log("req.userId:", req.userId);
        console.log("req.body:", req.body);
        console.log("req.file:", req.file);

        const { name, username, bio, profession, gender } = req.body;

        const user = await User.findById(req.userId).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        const sameUserWithUsername = await User.findOne({ username }).select("-password");
        if (sameUserWithUsername && sameUserWithUsername._id.toString() !== req.userId) {
            return res.status(400).json({ message: "Username is already taken" });
        }

        if (req.file) {
            const profileImage = await uploadOnCloudinary(req.file.path);
            if (profileImage) user.profileImage = profileImage;
        }

        if (name) user.name = name;
        if (username) user.username = username;
        if (bio) user.bio = bio;
        if (profession) user.profession = profession;
        if (gender) user.gender = gender;

        await user.save();
        return res.status(200).json(user);

    } catch (error) {
        console.error("Edit profile error:", error);
        return res.status(500).json({ message: error.message });
    }
};


export const getProfile = async (req, res) => {
    try {
        // 🔹 Lấy đúng tham số theo route
        const { userName } = req.params;

        // 🔹 Truy vấn đúng field trong MongoDB (username, không phải userName)
        const user = await User.findOne({ username: userName }).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const follow = async (req, res) => {
    try {
        const currentUserId = req.userId;
        const targetUserId = req.params.targetUserId;

        if (!targetUserId) {
            return res.status(400).json({ message: "Target userId is required" });
        }

        if (currentUserId == targetUserId) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }
        const currentUser = await User.findById(currentUserId);
        const targetUser = await User.findById(targetUserId);

        const isFollowing = currentUser.following.includes(targetUserId);
        if (isFollowing) {
            currentUser.following = currentUser.following.filter(id => id.toString() != targetUserId);
            targetUser.followers = targetUser.followers.filter(id => id.toString() != currentUserId);
        } else {
            currentUser.following.push(targetUserId);
            targetUser.followers.push(currentUserId);
            if (currentUser._id != targetUser._id) {
                const notification = await Notification.create({
                    sender: currentUser._id,
                    receiver: targetUser._id,
                    type: "follow",
                    message: "started following you"
                })
                const populatedNotification = await Notification.findById(notification._id).
                    populate("sender receiver ");
                const receiverSocketId = getSocketId(targetUser._id)
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("newNotification", populatedNotification)
                }
            }
        }
        await currentUser.save();
        await targetUser.save();
        return res.status(200).json({ message: isFollowing ? "Unfollowed successfully" : "Followed successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const followingList = async (req, res) => {
    try {
        const result = await User.findById(req.userId);
        return res.status(200).json(result?.following);
    } catch (error) {
        console.error("Error in followingList:", error);
        return res.status(500).json({ message: error.message });
    }
};


export const search = async (req, res) => {
    try {
        const keyWord = req.query.keyWord;
        if (!keyWord) {
            return res.status(400).json({ message: "Missing keyWord parameter" });
        }

        const users = await User.find({
            $or: [
                { userName: { $regex: keyWord, $options: "i" } },
                { name: { $regex: keyWord, $options: "i" } }
            ]
        }).select("-password");

        return res.status(200).json(users);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            receiver: req.userId
        }).populate("sender receiver post loop").sort({ createdAt: -1 })

        return res.status(200).json(notifications)
    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error}` })
    }
}

export const markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.body

        if (Array.isArray(notificationId)) {
            await Notification.updateMany(
                { _id: { $in: notificationId }, receiver: req.userId },
                { $set: { isRead: true } }
            );
        } else {
            await Notification.findOneAndUpdate(
                { _id: notificationId, receiver: req.userId },
                { $set: { isRead: true } }
            );
        }


        return res.status(200).json({ message: "marked as read" })
    } catch (error) {
        return res.status(500).json({ message: `read notification error ${error}` })
    }
}
