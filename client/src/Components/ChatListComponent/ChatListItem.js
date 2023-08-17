import React from "react";
import classes from "./ChatListItem.module.css";
import { useState } from "react";
import { authActions } from "../../Store/AuthStore";
import { UseSelector, useSelector } from "react-redux";
import { getOtherPerson } from "../../Config/ChatLogic";
import { chatActions } from "../../Store/ChatStore";
import { useDispatch } from "react-redux";

const ChatListItem = ({ chat }) => {
  const loginUser = useSelector((state) => state.auth.loginUser);
  const highlightId = useSelector((state) => state.chat.highlightId);
  const dispatch = useDispatch();

  const style = {
    backgroundColor: highlightId == chat._id ? "#38B2AC" : "#E8E8E8",
  };

  const handleChatHighlight = () => {
    dispatch(chatActions.setSelectedChat(chat));
    dispatch(chatActions.setHighlightId(chat._id));
  };

  return (
    <div
      className={`m-1 p-2 rounded ${classes.background}`}
      onClick={handleChatHighlight}
      style={style}
    >
      <div className="d-flex align-items-center justify-content-between">
        <div className={classes["circle-image"]}>
          <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" />
        </div>
        <div className="d-flex flex-column align-items-end justify-content-start">
          <span className="text-start" style={{ marginRight: "120px" }}>
            {chat.isGroupChat
              ? chat.name
              : getOtherPerson(loginUser, chat.users)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatListItem;
