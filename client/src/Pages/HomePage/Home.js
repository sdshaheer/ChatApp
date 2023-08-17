import React from "react";
import { useState } from "react";
import Login from "../../Components/LoginComponent/Login";
import Register from "../../Components/RegisterComponent/Register";
import classes from "./Home.module.css";

const Home = () => {
  const [onLoginPage, setOnLoginPage] = useState(true);
  const [onRegisterPage, setOnRegisterPage] = useState(false);

  const loginStyle = {
    background: onLoginPage ? "#87CEEB" : "#FFFFFF",
  };

  const registerStyle = {
    background: onLoginPage ? "#FFFFFF" : "#87CEEB",
  };

  const handleLoginPage = () => {
    setOnLoginPage(true);
    setOnRegisterPage(false);
  };

  const handleRegisterPage = () => {
    setOnRegisterPage(true);
    setOnLoginPage(false);
  };

  return (
    <div className="container">
      <div className="d-flex flex-column justify-content-around align-items-center mt-4">
        <div className="mt-4 p-4 fs-4 shadow col-sm-8 col-md-6 text-center">
          Welcome to My Chat
        </div>
        <div className="mt-4 p-4 col-md-6 col-sm-12 border">
          <div className="d-flex justify-content-around">
            <span
              style={loginStyle}
              onClick={handleLoginPage}
              className="rounded-pill  w-50 p-2 m-2 cursor-pointer"
            >
              Login
            </span>
            <span
              style={registerStyle}
              onClick={handleRegisterPage}
              className="rounded-pill w-50 p-2 m-2"
            >
              Register
            </span>
          </div>
          <div>
            {onLoginPage && <Login />}
            {onRegisterPage && <Register />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
