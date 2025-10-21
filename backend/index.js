import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRouter from './routes/user.routes.js';
import postRouter from './routes/post.routes.js';
import loopRouter from './routes/loop.routes.js';
import storyRouter from './routes/story.routes.js';
import messageRouter from './routes/message.routes.js';
import { app, server } from './socket.js';


dotenv.config();

const port = process.env.PORT || 5000;

app.use(cors({
  origin: 'https://lumi-hm4h.onrender.com',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/post', postRouter);
app.use('/api/loop', loopRouter);
app.use('/api/story', storyRouter);
app.use('/api/message', messageRouter);

server.listen(port, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${port}`);
});

//829JJRUuOAb2eKmz
