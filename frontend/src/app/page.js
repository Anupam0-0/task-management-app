import React from "react";
import Link from "next/link";
import { UserContext } from "@/context/userContext"; // Assuming you have a UserContext to manage user state
import { useContext } from "react";

const Page = () => {

  const {user, loading} = useContext(UserContext); // Assuming you have a UserContext to manage user state

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return (
      <div>
        <p>You are not logged in.</p>
        <Link href="/login">Go to login</Link>
      </div>
    );
  }

  if (user.role === "admin") {
    return (
      <div>
        <p>Redirecting to admin dashboard...</p>
        <Link href="/admin/dashboard">Go to Admin Dashboard</Link>
      </div>
    );
  }

  return (
    <div>
      <p>Redirecting to user dashboard...</p>
      <Link href="/user/dashboard">Go to User Dashboard</Link>
    </div>
  );

};

export default Page;
