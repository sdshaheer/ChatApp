import React from "react";
import classes from "./UserListItem.module.css";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { chatActions } from "../../Store/ChatStore";
import { useNavigate } from "react-router-dom";

const UserListItem = ({ user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const chats = useSelector((state) => state.chat.chats);

  console.log("chats", chats);
  const handleChat = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/chat/accessChat",
        { otherUserId: user._id, chatName: user.name },
        {
          headers: {
            Authorization: localStorage.getItem("accessToken"),
          },
        }
      );
      console.log(data);
      if (!chats.find((chat) => chat._id === data.isChat._id)) {
        dispatch(chatActions.setChats([...chats, data.isChat]));
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      className={`m-1 p-2 rounded ${classes.background}`}
      onClick={handleChat}
    >
      <div className="d-flex align-items-center justify-content-around">
        <div className={classes["circle-image"]}>
          <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" />
        </div>
        <div className="d-flex flex-column align-items-start justify-content-between">
          <span>{user.name}</span>
          <span>Email : {user.email}</span>
        </div>
      </div>
    </div>
  );
};

export default UserListItem;
