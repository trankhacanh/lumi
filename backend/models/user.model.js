import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        profileImage: { type: String, default: "" },
        followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
        saved: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
        loops: [{ type: mongoose.Schema.Types.ObjectId, ref: "Loop" }],
        story: [{ type: mongoose.Schema.Types.ObjectId, ref: "Story" }],
        bio: { type: String, default: "" },
        profession: { type: String, default: "" },
        gender: { type: String, enum: ["male", "female"] },
        resetOtp: { type: String },
        otpExpires: { type: Date },
        isOtpVerified: { type: Boolean, default: false },
    }, { timestamps: true })

const User = mongoose.model("User", userSchema);

export default User;