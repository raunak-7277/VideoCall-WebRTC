import axios from "axios";
import httpStatus from "http-status";
import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import servers from "../enviroment";
export const AuthContext = createContext(null);

const client = axios.create({
  baseURL: `${servers.prod}/api/v1/users`,
});

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const router = useNavigate();

  const handleRegister = async (name, username, password) => {
    try {
      const request = await client.post("/register", {
        name,
        username,
        password,
      });

      if (request.status === httpStatus.CREATED) {
        return { success: true, message: request.data.message };
      }
      
      return { success: false, message: "Registration failed" };

    } catch (err) {
      console.log(err);
      const msg = err.response?.data?.message || "Something went wrong";
      return { success: false, message: msg };
    }
  };


  const handleLogin = async (username, password) => {
    try {
      let request = await client.post("/login", {
        username: username,
        password: password
      });

      if (request.status === httpStatus.OK) {
        localStorage.setItem("token", request.data.token);
        router("/home");
        return { success: true, message: request.data.message };
      }
      return { success: false, message: "Login failed" };

    } catch (err) {
      console.log(err);
      const msg = err.response?.data?.message || "Login Failed";
      return { success: false, message: msg };
    }
  };

  const getHistoryOfUser=async()=>{
    try {
      let req=await client.get("get_all_activity",{params:{
        token :localStorage.getItem("token")
      }})
      return req.data;
    } catch (error) {
      throw error;
    }
  }

  const addToUserHistory = async (meetingCode) => {
        try {
            let request = await client.post("/add_to_activity", {
                token: localStorage.getItem("token"),
                meeting_code: meetingCode
            });
            return request
        } catch (e) {
            throw e;
        }
    }


  const value = {
    userData,
    setUserData,
    handleRegister,
    handleLogin,
    getHistoryOfUser,
    addToUserHistory
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};