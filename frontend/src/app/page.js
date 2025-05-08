"use client";
import React, { useContext } from "react";
import Link from "next/link";
import { useUser } from "@/context/userContext";

const Page = () => {
  const { user, loading } = useUser();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    redirect("/login");
    return (
      <div>
        <p>You are not logged in.</p>
        <Link href="/login">Go to login</Link>
      </div>
    );
  }

  if (user.role === "admin") {
    redirect("/admin/dashboard");
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
