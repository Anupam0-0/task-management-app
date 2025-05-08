"use client";
import React, { useContext, useState } from "react";
import { validateEmail } from "@/utils/helper";
import Link from "next/link";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";
import { useUser } from "@/context/userContext";
import axios from "axios";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { updateUser } = useUser(); // Assuming you have a UserContext to manage user state

  const handleBackend = async () => {
    try {
      const response = await axios.get("http://localhost:5000/");
      console.log(response.data); // Handle the response as needed
      alert(response.data); // Handle the response as needed
    } catch (error) {
      console.error("Error fetching data from backend:", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please fill all the fields");
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);

        if (response.data.role === "admin") {
          window.location.href = "/admin/dashboard";
        } else {
          window.location.href = "/user/dashboard";
        }
      }
    } catch (error) {
      console.log(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Something went wrong || Please wait, the server might be doing a cold start"
      );
      setError(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-normal px-4 py-4">
      <div className="flex items-center justify-between p-1 border border-neutral-200 rounded">
        <Link
          className="border  bg-neutral-50 py-0.5 px-18 rounded"
          href="/register"
        >
          Register
        </Link>
        <Link
          className="border bg-neutral-200 py-0.5 px-18 rounded"
          href="/login"
        >
          Login
        </Link>
      </div>

      <h1 className="px-2 mx-auto font-bold py-4 w-fit text-2xl">
        Welcome Back!{" "}
      </h1>

      <div className="flex flex-col gap-4 place-items-center py-2">
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="outline-none text-sm py-1 px-4 border border-black/10 focus:shadow rounded  w-96"
        />

        <input
          type="text"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="outline-none text-sm py-1 px-4 border border-black/10 focus:shadow rounded  w-96"
        />

        {error && <p className="text-red-500 text-xs">{error}</p>}
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`text-sm w-96 p-2 mt-4 rounded ${
            loading ? "bg-gray-400" : "bg-blue-500 text-white"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="text-sm my-2 text-black/50">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-500 cursor-pointer">
            Register
          </Link>
        </p>

        <button onClick={handleBackend}>
          click here to get response from backend
        </button>
      </div>
    </div>
  );
};

export default Page;
