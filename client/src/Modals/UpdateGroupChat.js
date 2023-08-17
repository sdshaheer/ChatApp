import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../Store/AuthStore";
import { chatActions } from "../Store/ChatStore";
import { Button } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import classes from "./GroupChatModal.module.css";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import useSearch from "../CustomHooks/useSearch";

const UpdateGroupChat = (props) => {
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  const chats = useSelector((state) => state.chat.chats);
  const loginUser = useSelector((state) => state.auth.loginUser);
  const dispatch = useDispatch();

  const [searchValue, setSearchValue] = useState("");
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState(selectedChat.users);
  const [url, setUrl] = useState(`http://localhost:5000/api/user?search=''`);

  //   console.log("logiUser", loginUser);
  //   console.log("selectedChat", selectedChat);
  //   console.log("selected", selectedUsers);
  const { users } = useSearch(url);

  const handleLeftGroup = () => {};

  const HandleAddUser = async (addUser) => {
    const filteredUser = selectedUsers.filter(
      (user) => user._id === addUser._id
    );
    //console.log(addUser, filteredUser);
    if (
      filteredUser.length != 0 ||
      selectedChat.groupAdmin._id !== loginUser.userId
    )
      return;
    try {
      const { data } = await axios.put(
        "http://localhost:5000/api/chat/addToGroupChat",
        { chatId: selectedChat._id, userId: addUser._id },
        {
          headers: {
            Authorization: localStorage.getItem("accessToken"),
          },
        }
      );
      console.log("added", data);
      dispatch(chatActions.setSelectedChat(data.updatedChat));
      //setSelectedUsers(data.updatedChat);
    } catch (error) {
      console.log(error);
    }
  };

  const removeSelectedUser = async (removeUserId) => {
    if (selectedChat.groupAdmin._id !== loginUser.userId) return;
    try {
      const { data } = await axios.put(
        "http://localhost:5000/api/chat/deleteFromGroupChat",
        { chatId: selectedChat._id, userId: removeUserId },
        {
          headers: {
            Authorization: localStorage.getItem("accessToken"),
          },
        }
      );
      console.log("deleted", data);
      if (removeUserId === loginUser.userId) {
        dispatch(chatActions.setSelectedChat(null));
        return;
      }
      dispatch(chatActions.setSelectedChat(data.updatedChat));
      //setSelectedUsers(filteredUsers);
    } catch (error) {
      console.log(error);
    }
  };

  const handleModalHide = () => {
    props.hide();
  };

  const updateGroupName = async () => {
    if (groupName == "") return;
    try {
      const { data } = await axios.put(
        "http://localhost:5000/api/chat/renameGroupChat",
        { chatId: selectedChat._id, chatName: groupName },
        {
          headers: {
            Authorization: localStorage.getItem("accessToken"),
          },
        }
      );
      console.log("updates", data);
      dispatch(chatActions.setSelectedChat(data.updatedChat));
      const filteredChats = chats.filter(
        (chat) => chat._id !== selectedChat._id
      );
      setGroupName("");
      dispatch(chatActions.setChats([data.updatedChat, ...filteredChats]));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let timer = setTimeout(() => {
      setUrl(`http://localhost:5000/api/user?search=${searchValue}`);
      console.log("debounce");
    }, 500);
    return () => clearTimeout(timer);
  }, [searchValue]);

  useEffect(() => {
    setUrl(`http://localhost:5000/api/user?search=''`);
    setSearchValue("");
    setSelectedUsers(selectedChat.users);
  }, [selectedChat]);

  return (
    <Modal show={props.show} onHide={handleModalHide} centered>
      <Modal.Header style={{ border: "none" }} closeButton>
        <Modal.Title className="d-flex justify-content-center align-items-center w-100 m-2">
          <h3 className="text-center w-100">{selectedChat.name}</h3>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-wrap w-75">
          {selectedUsers.length > 0 &&
            selectedUsers.map((user) => {
              return (
                <div
                  key={`${user._id} ${user.name}`}
                  className="d-flex justify-content-between align-items-center bg-success rounded m-1 p-1"
                >
                  {loginUser.userId !== user._id ? user.name : "You"}
                  {loginUser.userId !== user._id ? (
                    <span>
                      <IoClose
                        style={{ cursor: "pointer", marginLeft: "3px" }}
                        onClick={() => removeSelectedUser(user._id)}
                      />
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              );
            })}
        </div>
        <div className="d-flex flex-column w-75 mb-2">
          <div>
            <div className="d-flex justify-content-between align-items-center">
              <input
                type="text"
                placeholder="Enter Group name "
                className="form-control mb-2"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
              <button
                onClick={updateGroupName}
                className="btn btn-primary mx-2 mb-3"
              >
                Update
              </button>
            </div>
            <input
              type="text"
              placeholder="search user"
              className="form-control "
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </div>
        {users.length > 0 &&
          users.map((user) => {
            return (
              <div
                className={`m-1 p-2 rounded w-75 ${classes.background}`}
                onClick={() => HandleAddUser(user)}
                key={user._id}
              >
                <div className="d-flex align-items-center justify-content-around">
                  <div className={classes["circle-image"]}>
                    <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" />
                  </div>
                  <div className="d-flex flex-column align-items-start justify-content-between">
                    <span>{user.name}</span>
                    <span>email: {user.email}</span>
                  </div>
                </div>
              </div>
            );
          })}
      </Modal.Body>
      <Modal.Footer style={{ border: "none" }}>
        <Button
          variant="danger"
          onClick={() => removeSelectedUser(loginUser.userId)}
        >
          Left Group
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateGroupChat;
