import express from 'express';
import { follow, followingList, getAllNotifications, getCurrentUser, getProfile, markAsRead, search } from '../controllers/user.controllers.js';
import isAuth from '../middlewares/isAuth.js';
import { suggestedUsers } from '../controllers/user.controllers.js';
import { editProfile } from '../controllers/user.controllers.js';
import { upload } from '../middlewares/multer.js'; // ✅ đúng cách


const userRouter = express.Router();

userRouter.get("/current", isAuth, getCurrentUser);
userRouter.get("/suggested", isAuth, suggestedUsers);
userRouter.post("/editProfile", isAuth, upload.single("profileImage"), editProfile);
userRouter.get("/getProfile/:userName", isAuth, getProfile);
userRouter.get("/follow/:targetUserId", isAuth, follow);
userRouter.get("/followingList", isAuth, followingList);
userRouter.get("/search", isAuth, search);
userRouter.get("/getAllNotifications", isAuth, getAllNotifications);
userRouter.post("/markAsRead", isAuth, markAsRead);
userRouter.get("/search", isAuth, search);
export default userRouter;