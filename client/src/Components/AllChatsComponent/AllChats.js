import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import classes from "./AllChats.module.css";
import Button from "react-bootstrap/Button";
import { AiOutlinePlus } from "react-icons/ai";
import { chatActions } from "../../Store/ChatStore";
import ChatListItem from "../ChatListComponent/ChatListItem";
import GroupChatModal from "../../Modals/GroupChatModal";

const AllChats = () => {
  const chats = useSelector((state) => state.chat.chats);
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  //const [highlightId, setHighlightId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();

  // const handleHighlight = (id) => {
  //   setHighlightId(id);
  // };

  const createGroupChat = () => {
    setShowModal(true);
  };

  const fetchAllChats = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/chat/fetchChats",
        {
          headers: {
            Authorization: localStorage.getItem("accessToken"),
          },
        }
      );
      console.log(data);
      dispatch(chatActions.setChats(data.chats));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchAllChats();
  }, [selectedChat]);
  return (
    <div className={` d-none d-sm-block ${classes.container}`}>
      <div className="d-flex justify-content-around align-items-center bg-info rounded p-2 ">
        <span className={classes.header}>My Chats</span>
        <Button variant="secondary" onClick={createGroupChat}>
          <div className="d-flex justify-content-between align-items-center">
            <span className="m-1 text-center">create group chat</span>
            <AiOutlinePlus size={25} className="mx-2" />
          </div>
        </Button>
      </div>
      <div>
        {chats.length > 0 &&
          chats.map((chat) => {
            return (
              <ChatListItem
                chat={chat}
                // highlightId={highlightId}
                // highlight={handleHighlight}
                key={chat._id}
              />
            );
          })}
      </div>
      <GroupChatModal show={showModal} hide={() => setShowModal(false)} />
    </div>
  );
};

export default AllChats;
