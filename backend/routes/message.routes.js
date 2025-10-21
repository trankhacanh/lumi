import express from 'express';

import isAuth from '../middlewares/isAuth.js';

import { upload } from '../middlewares/multer.js';
import { getAllMessages, sendMessage } from '../controllers/message.controllers.js';
import { getPrevUserChats } from '../controllers/message.controllers.js';



const messageRouter = express.Router();

messageRouter.post("/send/:receiverId", isAuth, upload.single("image"), sendMessage);
messageRouter.get("/getAll/:receiverId", isAuth, getAllMessages);
messageRouter.get("/prevChats", isAuth, getPrevUserChats);

export default messageRouter;