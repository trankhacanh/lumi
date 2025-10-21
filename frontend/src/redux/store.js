import { configureStore } from "@reduxjs/toolkit";
import userSlide from "./userSlice.js"
import postSlice from "./postSlice.js"
import storySlide from "./storySlice.js"
import loopSlide from "./loopSlice.js"
import messageSlice from "./mesageSlice.js"
import socketSlice from "./socketSlice.js"

export const store = configureStore({
    reducer: {
        user: userSlide,
        post: postSlice,
        story: storySlide,
        loop: loopSlide,
        message: messageSlice,
        socket: socketSlice,
    }
});
export default store;