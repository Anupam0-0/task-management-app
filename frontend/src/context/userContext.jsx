"use client";
import React, {
  createContext,
  useEffect,
  useState,
  useCallback,
  useContext,
} from "react";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // Added role state
  const [loading, setLoading] = useState(true);

  const clearUser = useCallback(() => {
    setUser(null);
    localStorage.removeItem("token");
    setLoading(false);
  }, []);


  const fetchUser = useCallback(async () => {
    const accessToken = localStorage.getItem("token");
    if (!accessToken) {
      clearUser();
      return;
    }

    try {
      const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE, {
        headers: { Authorization: `Bearer ${accessToken}` }, // Ensure token is sent
      });
      setUser(response.data);
      console.log("User data:", response.data); // Log user data for debugging
      // it has id, name, email, task, role, bio and profilePic
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      clearUser(); // Only clear if the API call fails
    } finally {
      setLoading(false);
    }
  }, [clearUser]);


  useEffect(() => {
    fetchUser();
  }, [fetchUser]);


  const updateUser = (userData) => {
    if (userData?.token) {
      localStorage.setItem("token", userData.token); // Save token first
    }
    setUser(userData); // Then set the user
    setRole(userData?.role); // Set role if available
    setLoading(false);
  };

  return (
    <UserContext.Provider value={{ user, role, loading, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

export default UserProvider;
