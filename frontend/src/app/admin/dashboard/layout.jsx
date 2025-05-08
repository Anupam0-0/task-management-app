"use client";
import { useUser } from "@/context/userContext";
import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const layout = ({ children }) => {
  const user = useUser();

  return (
    <div className="h-screen w-full overflow-hidden bg-neutral-100">
      <Navbar />

      {user && (
        <div className="flex text-black w-full max-w-[90rem] mx-auto">
          <div className="hidden md:flex  h-screen bg-neutral-100"><Sidebar/></div>
          <div className="w-full bg-neutral-100">{children}</div>
        </div>
      )}
    </div>
  );
};

export default layout;
