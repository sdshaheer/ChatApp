import React from "react";
import classes from "./RightSideBar.module.css";
import { IoNotifications } from "react-icons/io5";
import { Dropdown } from "react-bootstrap";
import { useState, useEffect } from "react";
import Profile from "../ProfileComponent/Profile";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../Store/AuthStore";
import { useNavigate } from "react-router-dom";
import { chatActions } from "../../Store/ChatStore";
import { getOtherPerson } from "../../Config/ChatLogic";
import Badge from "react-bootstrap/Badge";

const RightSideBar = () => {
  const notification = useSelector((state) => state.chat.notification);
  const loginUser = useSelector((state) => state.auth.loginUser);
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  const [selectedItem, setSelectedItem] = useState("");
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNavigate = (notichat) => {
    console.log("chat redirection", notichat);
    dispatch(chatActions.setSelectedChat(notichat.chat));
    const filteredNotifications = notification.filter(
      (noti) => noti._id !== notichat._id
    );
    dispatch(chatActions.setNotification(filteredNotifications));
    dispatch(chatActions.setHighlightId(notichat.chat._id));
  };

  const handleSelect = (eventKey) => {
    console.log(eventKey);
    setSelectedItem(eventKey);
    if (eventKey == "profile") {
      setShowModal(true);
    } else {
      dispatch(authActions.logout());
      localStorage.removeItem("accessToken");
      localStorage.removeItem("isLogin");
      navigate("/home");
    }
  };

  return (
    <div className="d-flex justify-content-between align-items-center">
      <Dropdown>
        <Dropdown.Toggle className={classes.dropdown} id="dropdown-basic">
          {notification.length > 0 && (
            <Badge style={{ borderRadius: "50%" }} bg="danger">
              {notification.length}
            </Badge>
          )}

          <IoNotifications
            size={25}
            className="notification"
            style={{ marginRight: "15px" }}
          />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {!notification.length && "No new Messages"}
          {notification.map((noti) => {
            return (
              <Dropdown.Item
                key={noti._id}
                onClick={() => handleNavigate(noti)}
              >
                {noti.chat.isGroupChat
                  ? `New message from ${noti.chat.name}`
                  : `New message from ${getOtherPerson(
                      loginUser,
                      noti.chat.users
                    )}`}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
      <Dropdown onSelect={handleSelect}>
        <Dropdown.Toggle
          variant="light"
          className={classes.dropdown}
          id="dropdown-basic"
        >
          <div className={classes["circle-image"]}>
            <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" />
          </div>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item eventKey="profile">Profile</Dropdown.Item>
          <Dropdown.Item eventKey="logout">Logout</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <Profile show={showModal} onHide={() => setShowModal(false)} />
    </div>
  );
};

export default RightSideBar;
