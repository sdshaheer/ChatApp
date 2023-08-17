import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import classes from "./GroupChatModal.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { IoClose } from "react-icons/io5";
import { chatActions } from "../Store/ChatStore";
import { useDispatch, useSelector } from "react-redux";

const GroupChatModal = (props) => {
  const [searchValue, setSearchValue] = useState("");
  const [groupName, setGroupName] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const dispatch = useDispatch();
  const chats = useSelector((state) => state.chat.chats);

  const HandleAddUserId = (addUser) => {
    const filteredUsers = selectedUsers.filter(
      (user) => user._id == addUser._id
    );
    if (filteredUsers.length === 0) {
      setSelectedUsers([...selectedUsers, addUser]);
    }
  };

  // hide the modal
  const handleModalHide = () => {
    setSearchValue("");
    setGroupName("");
    setUsers([]);
    setSelectedUsers([]);
    props.hide();
  };

  const removeSelectedUser = (removeUser) => {
    const filteredUsers = selectedUsers.filter(
      (user) => user._id != removeUser._id
    );
    setSelectedUsers(filteredUsers);
  };

  // create a group chat
  const createGroup = async (name, users) => {
    console.log("in grop chat");
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/chat/createGroupChat",
        { name: name, users: users },
        {
          headers: {
            Authorization: localStorage.getItem("accessToken"),
          },
        }
      );
      console.log(data);
      if (!chats.find((chat) => chat._id === data.groupChat._id)) {
        dispatch(chatActions.setChats([data.groupChat, ...chats]));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // retrieve users based on search
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/user?search=${searchValue}`,
        {
          headers: {
            Authorization: localStorage.getItem("accessToken"),
          },
        }
      );
      setUsers(data.users);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateGroup = () => {
    const userIds = selectedUsers.map((user) => user._id);
    createGroup(groupName, userIds);
    handleModalHide();
  };

  useEffect(() => {
    let timer = setTimeout(() => {
      fetchUsers();
      console.log("debounce");
    }, 500);
    return () => clearTimeout(timer);
  }, [searchValue]);

  //console.log("chats", chats);
  return (
    <Modal show={props.show} onHide={handleModalHide} centered>
      <Modal.Header style={{ border: "none" }} closeButton>
        <Modal.Title className="d-flex justify-content-center align-items-center w-100 m-2">
          <h3 className="text-center w-100">Create Group Chat</h3>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column w-75 mb-2">
          <div>
            <input
              type="text"
              placeholder="Enter Group name "
              className="form-control mb-2"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
            <input
              type="text"
              placeholder="search user"
              className="form-control "
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </div>
        <div className="d-flex flex-wrap w-75">
          {selectedUsers.length > 0 &&
            selectedUsers.map((user) => {
              return (
                <div
                  key={user._id}
                  className="d-flex justify-content-between align-items-center bg-success rounded m-1 p-1"
                >
                  {user.name}
                  <span>
                    <IoClose
                      style={{ cursor: "pointer", marginLeft: "3px" }}
                      onClick={() => removeSelectedUser(user)}
                    />
                  </span>
                </div>
              );
            })}
        </div>
        {users.length > 0 &&
          users.map((user) => {
            return (
              <div
                className={`m-1 p-2 rounded w-75 ${classes.background}`}
                onClick={() => HandleAddUserId(user)}
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
        <Button variant="primary" onClick={handleCreateGroup}>
          create
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GroupChatModal;
