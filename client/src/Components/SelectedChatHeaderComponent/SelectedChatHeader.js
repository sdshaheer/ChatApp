import React from "react";
import classes from "./SelectedChatHeader.module.css";
import { getOtherPerson } from "../../Config/ChatLogic";
import { FaArrowLeft } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useState } from "react";
import UpdateGroupChat from "../../Modals/UpdateGroupChat";

const SelectedChatHeader = (props) => {
  const [showModal, setShowModal] = useState(false);

  const handleUpdate = () => {
    setShowModal(true);
  };
  return (
    <div
      className={`d-flex justify-content-between align-items-center m-1 p-2 rounded ${classes.background}`}
    >
      <div className="d-flex align-items-center">
        <FaArrowLeft
          style={{ marginRight: "15px", cursor: "pointer" }}
          className="d-block d-sm-none"
        />
        <div className={classes["circle-image"]}>
          <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" />
        </div>
        <div className="d-flex flex-column align-items-end justify-content-start">
          <span className="text-start" style={{ marginRight: "120px" }}>
            {props.isGroupChat
              ? props.name
              : getOtherPerson(props.loginUser, props.users)}
          </span>
        </div>
      </div>
      <BsThreeDotsVertical
        onClick={handleUpdate}
        style={{ marginRight: "10px", cursor: "pointer" }}
      />
      <UpdateGroupChat show={showModal} hide={() => setShowModal(false)} />
    </div>
  );
};

export default SelectedChatHeader;
