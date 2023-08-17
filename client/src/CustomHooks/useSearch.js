import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

const useSearch = (url) => {
  const [users, setUsers] = useState([]);
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(url, {
        headers: {
          Authorization: localStorage.getItem("accessToken"),
        },
      });
      setUsers(data.users);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [url]);

  return { users };
};

export default useSearch;
