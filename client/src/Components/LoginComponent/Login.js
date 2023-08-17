import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../../Store/AuthStore";
import { chatActions } from "../../Store/ChatStore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("password");
  const isLogin = useSelector((state) => state.auth.isLogin);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const userDetails = { email, password };
      console.log(userDetails);
      const { data } = await axios.post(
        "http://localhost:5000/api/user/login",
        userDetails
      );
      if (data?.success) {
        localStorage.setItem("accessToken", `Bearer ${data.accessToken}`);
        dispatch(authActions.login(true));
        dispatch(authActions.setLoginUser(data.user));
        localStorage.setItem("isLogin", true);
        console.log(data);
        navigate("/chat");
      } else {
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <div className="mt-4">
        <input
          className="form-control mt-2"
          type="email"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="mt-4">
        <input
          className="form-control mt-2"
          type="password"
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="mt-4">
        <button
          type="button"
          className="form-control btn btn-primary mt-2"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
