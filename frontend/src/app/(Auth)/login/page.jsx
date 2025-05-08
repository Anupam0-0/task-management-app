import React, { useContext, useState } from "react";
import { validateEmail } from "@/utils/helper";
import Link from "next/link";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";
import { UserContext } from "@/context/userContext";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const {updateUser} = useContext(UserContext); // Assuming you have a UserContext to manage user state

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    // setLoading(true) // to be aaded later

    if (!email || !password) {
      setError("Please fill all the fields");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");

    // LOGIN API CALL
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data); // Assuming updateUser is a function to update user context

        if (role === "admin") {
          window.location.href = "/admin/dashboard";
        } else {
          window.location.href = "/user/dashboard";
        }
      }
    } catch (error) {
      console.log(error);
      setError(
        "Something went wrong || Pls wait the server might be doing a cold start"
      );
    }

    // setLoading(false) // to be aaded later
  };

  return (
    <div className="font-normal">
      Login Page this is login page
      {error && <p className="text-red-500 text-xs py-2">{error}</p>}
      <button className="text-sm">Login</button>
      <p className="text-sm my-2">
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-500 cursor-pointer">
          Register
        </Link>
      </p>
    </div>
  );
};

export default Page;
