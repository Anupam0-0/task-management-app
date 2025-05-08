import React from "react";
import { validateEmail } from "@/utils/helper";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";
import { UserContext } from "@/context/userContext"; // Assuming you have a UserContext to manage user state
import { useContext } from "react";

const page = () => {
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [adminCode, setAdminCode] = React.useState("");
  // const [loading, setLoading] = React.useState(false) // to be aaded later

  const { updateUser } = useContext(UserContext); // Assuming you have a UserContext to manage user state



  const handleRegister = async (e) => {
    e.preventDefault();

    let profilePic = '';

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
      if(!profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profilePic = imgUploadRes.data.url || " "; // Assuming the response contains the image URL
      }

      const reponse = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email,
        password,
        confirmPassword,
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
      console.log(error);
      setError(
        "Something went wrong || Pls wait the server might be doing a cold start"
      );
    }
  };

  return <div>page</div>;
};

export default page;
