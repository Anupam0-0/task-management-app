"use client";
import React, { useContext } from "react";
import { validateEmail } from "@/utils/helper";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";
import { useUser } from "@/context/userContext"; // Assuming you have a UserContext to manage user state
import uploadImage from "@/utils/uploadImage";
import Link from "next/link";

const page = () => {
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [adminCode, setAdminCode] = React.useState("");
  const [loading, setLoading] = React.useState(false); // to be aaded later

  const { updateUser } = useUser(); // Assuming you have a UserContext to manage user state

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    let profilePic = "";

    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill all the fields");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");

    // REGISTER API CALL
    try {
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profilePic = imgUploadRes.data.url || " "; // Assuming the response contains the image URL
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      const reponse = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        adminCode,
      });

      const { token, role } = reponse.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(reponse.data); // Assuming updateUser is a function to update user context

        if (role === "admin") {
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
          className="border bg-neutral-200 py-0.5 px-18 rounded"
          href="/register"
        >
          Register
        </Link>
        <Link
          className="border bg-neutral-50 py-0.5 px-18 rounded"
          href="/login"
        >
          Login
        </Link>
      </div>

      <h1 className="px-2 font-bold mx-auto py-4 w-fit text-2xl">
        {" "}
        Welcome to our platform!{" "}
      </h1>

      <div className="flex flex-col gap-4 place-items-center py-2">
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="outline-none text-sm py-1 px-4 border border-black/10 focus:shadow rounded  w-96"
        />

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

        <input
          type="text"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="outline-none text-sm py-1 px-4 border border-black/10 focus:shadow rounded  w-96"
        />

        <input
          type="text"
          placeholder="admin code (if any)"
          value={adminCode}
          onChange={(e) => setAdminCode(e.target.value)}
          className="outline-none text-sm py-1 px-4 border border-black/10 focus:shadow rounded  w-96"
        />

        {error && <p className="text-red-500 text-xs py-2">{error}</p>}
        <button
          onClick={handleRegister}
          className="text-sm w-96 p-2 text-white mt-4 bg-blue-500 rounded "
        >
          Register
        </button>
        <p className="text-sm my-2 text-black/50">
          Already have an account?{" "}
          <Link href="/register" className="text-blue-500 cursor-pointer">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default page;
