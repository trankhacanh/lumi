// src/api/getAllLoops.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { severUrl } from "../App";
import { setLoopData } from "../redux/loopSlice";

function useGetAllLoops() {
    const dispatch = useDispatch();
    const { userData } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchLoops = async () => {
            try {
                const res = await axios.get(`${severUrl}/api/loop/getAll`, {
                    withCredentials: true,
                });
                dispatch(setLoopData(res.data));
            } catch (err) {
                console.error("❌ Error fetching loops:", err);
            }
        };

        fetchLoops();
    }, [dispatch, userData]);
}

export default useGetAllLoops;
