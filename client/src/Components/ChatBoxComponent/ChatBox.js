import React, { useEffect, useState } from "react";
import classes from "./ChatBox.module.css";
import { chatActions } from "../../Store/ChatStore";
import { authActions } from "../../Store/AuthStore";
import { useSelector, useDispatch } from "react-redux/";
import SelectedChatHeader from "../SelectedChatHeaderComponent/SelectedChatHeader";
import axios from "axios";
import { isSameSender, isLastMessage } from "../../Config/ChatLogic";
import io from "socket.io-client";

const END_POINT = "http://localhost:5000";
var socket, selectedChatCompare;

const ChatBox = () => {
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  const loginUser = useSelector((state) => state.auth.loginUser);
  const notification = useSelector((state) => state.chat.notification);
  const dispatch = useDispatch();
  console.log("selected", selectedChat);

  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    socket = io(END_POINT);
    socket.emit("setUp", loginUser.userId);
    socket.on("connected", () => setSocketConnected(true));
  }, []);

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/message/allMessagesByChatId/${selectedChat._id}`,
        {
          headers: {
            Authorization: localStorage.getItem("accessToken"),
          },
        }
      );
      console.log("fetched", data);
      setChatMessages(data.messages);
      //socket.emit("joinRoom", selectedChat._id);
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = async (e) => {
    if (e.key === "Enter" && message) {
      try {
        setMessage("");
        const { data } = await axios.post(
          "http://localhost:5000/api/message/sendMessage",
          { content: message, chatId: selectedChat._id },
          {
            headers: {
              Authorization: localStorage.getItem("accessToken"),
            },
          }
        );
        console.log(data);
        socket.emit("newMessage", data.sentMessage);
        setChatMessages([...chatMessages, data.sentMessage]);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const typingHandler = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    console.log("hello ............");
    socket.on("messageRecieved", (newMessage) => {
      //console.log("ids of chats", newMessage.chat._id, selectedChat._id);
      if (!selectedChat || selectedChat._id !== newMessage.chat._id) {
        // give notification
        console.log("in notification");
        const present = notification.filter(
          (noti) => noti.chat._id === newMessage.chat._id
        );
        console.log(present);
        if (present.length === 0) {
          dispatch(chatActions.setNotification([newMessage, ...notification]));
        }
      } else {
        console.log("....................asassa.........");
        setChatMessages([...chatMessages, newMessage]);
      }
    });
  });

  console.log("notification", notification);

  return (
    <div className={classes.container}>
      {!selectedChat ? (
        <h3 className="text-center">select use</h3>
      ) : (
        <div className="d-flex flex-column justify-content-between h-100">
          <div>
            <SelectedChatHeader
              loginUser={loginUser}
              users={selectedChat.users}
              name={selectedChat.name}
              isGroupChat={selectedChat.isGroupChat}
            />
          </div>
          <div className={classes.chatBox}>
            <div className={classes.messages}>
              {chatMessages &&
                chatMessages.map((msg, i) => {
                  return (
                    <div
                      className="d-flex align-items-center mx-2"
                      style={{
                        display: "flex",
                        justifyContent:
                          msg.sender._id === loginUser.userId
                            ? "flex-end"
                            : "flex-start",
                      }}
                    >
                      {isSameSender(chatMessages, msg, i, loginUser.userId) ||
                      isLastMessage(chatMessages, i, loginUser.userId) ? (
                        <div className={classes["circle-image"]}>
                          <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" />
                        </div>
                      ) : (
                        <div className={classes["circle-image"]}></div>
                      )}
                      <span
                        className="d-flex m-2 mx-0 p-1 rounded"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          backgroundColor:
                            msg.sender._id === loginUser.userId
                              ? "#A3CEDC"
                              : "#C1ECFA",
                        }}
                      >
                        {msg.content}
                      </span>
                    </div>
                  );
                })}
            </div>
            <div className="m-2">
              <input
                type="text"
                className="form-control mb-1"
                placeholder="start typing here to chat"
                value={message}
                onChange={typingHandler}
                onKeyDown={sendMessage}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
