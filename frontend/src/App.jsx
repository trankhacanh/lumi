import React from "react";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { Navigate, Route, Routes } from "react-router-dom";
import ForgotPassword from "./pages/ForgotPassword";
import { useSelector } from "react-redux";
import Home from "./pages/Home";
import useCurrentUser from "./hooks/getCurrentUser";
import useSuggestedUsers from "./hooks/getSuggestedUser";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Upload from "./pages/Upload";
import getAllPost from "./hooks/getAllPost";
import Loops from "./pages/Loops";
import useGetAllLoops from "./hooks/getAllLoops";
import Story from "./pages/Story";
import getAllStories from "./hooks/getAllStories";
import { io } from "socket.io-client";
import Messages from "./pages/Messages";
import MessageArea from "./pages/MessageArea";
export const severUrl = "http://localhost:8000";
import { useDispatch } from "react-redux";
import { setOnlineUsers, setSocket } from "./redux/socketSlice";
import getFollowingList from "./hooks/getFollowingList";
import Search from "./pages/Search";
import getAllNotifications from "./hooks/getAllNotifications";
import Notifications from "./pages/Notifications";
import { useEffect } from "react";
import { setNotificationData } from "./redux/userSlice";

function App() {
  useCurrentUser();
  useSuggestedUsers();
  getAllPost();
  useGetAllLoops();
  getAllStories();
  getFollowingList();
  getAllNotifications();
  const { userData, notificationData } = useSelector((state) => state.user);
  const { socket } = useSelector((state) => state.socket);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (userData) {
      const socketIo = io(severUrl, {
        query: { userId: userData._id },
      });
      dispatch(setSocket(socketIo));


      socketIo.on("getOnlineUsers", (users) => {
        dispatch(setOnlineUsers(users));
      });

      return () => socketIo.close();

    }
    else {
      if (socket) {
        socket.close();
        dispatch(setSocket(null));
      }
    }
  }, [userData]);


  socket?.on("newNotification", (noti) => {
    dispatch(setNotificationData([...notificationData, noti]))
  })


  return (
    <Routes>
      <Route path="/signin" element={!userData ? <SignIn /> : <Navigate to={"/"} />} />
      <Route path="/signup" element={!userData ? <SignUp /> : <Navigate to={"/"} />} />
      <Route path="/" element={userData ? <Home /> : <Navigate to={"/signin"} />} />
      <Route path="/forgot-password" element={!userData ? <ForgotPassword /> : <Navigate to={"/"} />} />
      <Route path="/profile/:userName" element={userData ? <Profile /> : <Navigate to={"/signin"} />} />
      <Route path="/story/:userName" element={userData ? <Story /> : <Navigate to={"/signin"} />} />
      <Route path="/upload" element={userData ? <Upload /> : <Navigate to={"/signin"} />} />
      <Route path="/search" element={userData ? <Search /> : <Navigate to={"/signin"} />} />
      <Route path="/editprofile" element={userData ? <EditProfile /> : <Navigate to={"/signin"} />} />
      <Route path="/messages" element={userData ? <Messages /> : <Navigate to={"/signin"} />} />
      <Route path="/messageArea" element={userData ? <MessageArea /> : <Navigate to={"/signin"} />} />
      <Route path="/notifications" element={userData ? <Notifications /> : <Navigate to={"/signin"} />} />
      <Route path="/loops" element={userData ? <Loops /> : <Navigate to={"/signin"} />} />
    </Routes>
  );
}

export default App;