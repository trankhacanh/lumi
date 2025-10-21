import { createSlice } from "@reduxjs/toolkit"
const postSlice = createSlice({
    name: "post",
    initialState: { // dữ liệu ban đầu của slice khi app mới khởi động.

        postData: [],

    },
    reducers: {
        setPostData: (state, action) => {
            state.postData = action.payload;
        },

    }

})
export const { setPostData } = postSlice.actions;
export default postSlice.reducer;