import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", profilePicture);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      console.log(formData);
      // const userDetails = { name, email, password, formData };
      // console.log(userDetails);
      const { data } = await axios.post(
        "http://localhost:5000/api/user/register",
        formData
      );
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <div className="mt-4">
        <input
          className="form-control mt-3"
          type="text"
          placeholder="Enter UserName"
          onChange={(e) => setName(e.target.value)}
        />
      </div>
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
      <div className="mt-4 d-flex flex-column">
        <span className="text-start mb-2">Upload Your Picture</span>
        <div className="">
          <input
            type="file"
            className="form-control col-md-10"
            accept=".jpeg, .png, .jpg"
            onChange={(e) => setProfilePicture(e.target.files[0])}
          />
        </div>
      </div>
      <div className="mt-4">
        <button
          type="button"
          className="form-control btn btn-primary mt-2"
          onClick={handleRegister}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Register;
