import React from "react";
import { useState, useEffect } from "react";
import SideBar from "../../Components/SideBarComponent/SideBar";
import { UseSelector, useSelector } from "react-redux/es/hooks/useSelector";
import AllChats from "../../Components/AllChatsComponent/AllChats";
import ChatBox from "../../Components/ChatBoxComponent/ChatBox";
import classes from "./Chat.module.css";

const Chat = () => {
  const chats = useSelector((state) => state.chat.chats);
  return (
    <div>
      <div>
        <SideBar />
      </div>
      <div className={classes.body}>
        <div className="col-md-3">
          <AllChats />
        </div>
        <ChatBox className="chatBox" />
      </div>
    </div>
  );
};

export default Chat;
