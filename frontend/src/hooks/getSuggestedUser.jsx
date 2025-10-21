import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setSuggestedUsers } from "../redux/userSlice";
import { severUrl } from "../App";

function useSuggestedUsers() {
    const dispatch = useDispatch();
    const { userData } = useSelector(state => state.user);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get(`${severUrl}/api/user/suggested`, {
                    withCredentials: true // gửi cookie HttpOnly sang server
                });
                dispatch(setSuggestedUsers(res.data));
            } catch (err) {
                console.error("Error fetching suggested users:", err);
            }
        };

        fetchUsers();
    }, [userData]);
}

export default useSuggestedUsers;
