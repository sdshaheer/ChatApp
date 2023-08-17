import React from "react";
import RightSideBar from "./RightSideBar";
import axios from "axios";
import { useState } from "react";
import UserListItem from "../UserListComponent/UserListItem";

const SideBar = () => {
  const [searchUser, setSearchUser] = useState("");
  const [users, setUsers] = useState([]);
  const handleUsers = async () => {
    if (searchUser == "") {
      return;
    }
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/user?search=${searchUser}`,
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

  return (
    <div className="d-flex .bg-body-secondary shadow justify-content-between p-2">
      <button
        className="btn btn-primary"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasScrolling"
        aria-controls="offcanvasScrolling"
      >
        serach user
      </button>

      <div>
        <h3>chat with person</h3>
      </div>

      <RightSideBar />
      <div
        className="offcanvas offcanvas-start"
        data-bs-scroll="true"
        data-bs-backdrop="false"
        tabindex="-1"
        id="offcanvasScrolling"
        aria-labelledby="offcanvasScrollingLabel"
      >
        <div className="offcanvas-header">
          <div
            className="d-flex offcanvas-title justify-content-between"
            id="offcanvasScrollingLabel"
          >
            <input
              type="text"
              className="form-control"
              placeholder="Enter user name"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handleUsers}>
              Go
            </button>
          </div>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          {users.length > 0 &&
            users.map((user) => {
              return <UserListItem user={user} key={user._id} />;
            })}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
