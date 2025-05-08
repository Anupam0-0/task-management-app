import React, { createContext, useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) return; // If user is already fetched, do not fetch again

    const accessToken = localStorage.getItem("token");
    if (!accessToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const accessToken = localStorage.getItem("token");
        if (accessToken) {
          const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
          setUser(response.data);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error(err);
        clearUser();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);


  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("token", userData.token); //save token
    setLoading(false);
  }

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("token");
    setLoading(false);
  };
  
    return (
        <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
        {children}
        </UserContext.Provider>
    );

};

export default UserProvider;
