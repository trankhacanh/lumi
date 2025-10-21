import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { severUrl } from "../App";
import { setPostData } from "../redux/postSlice";
import { useSelector } from "react-redux";

function getAllPost() {
    const dispatch = useDispatch();
    const { userData } = useSelector((state) => state.user);
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await axios.get(`${severUrl}/api/post/getAll`, {
                    withCredentials: true,
                });
                dispatch(setPostData(res.data));
            } catch (err) {
                console.error("Error fetching current user:", err);
            }
        };

        fetchPost();
    }, [dispatch, userData]);
}

export default getAllPost;
