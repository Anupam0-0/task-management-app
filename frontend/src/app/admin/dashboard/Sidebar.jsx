import React, { useState, useEffect } from "react";
import { useUser } from "@/context/userContext";
import { redirect } from "next/navigation";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from "@/utils/data";
import Image from "next/image";
import { Divide } from "lucide-react";

import AvatarPlaceholder from "/public/avatar.png"; // Placeholder for avatar image

const Sidebar = () => {
  const { user, clearUser } = useUser();
  const [isActive, setIsActive] = useState(); // Placeholder for active state
  const [sideMenuData, setSideMenuData] = useState([]);

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    redirect("/login");
  };

  const handleLogout = () => {
    clearUser();
    redirect("/login");
  };

  useEffect(() => {
    if (user) {
      setSideMenuData(
        user?.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA
      );
    }
    return () => {};
  }, [user]);

  return (
    <div className="sticky py-14 min-w-64 w-full top-0 border-x border-neutral-300 h-screen ">

      {/* Profile Picture */}
      <div className="flex flex-col items-center ">
        <Image
          src={user?.profileImageUrl || AvatarPlaceholder}
          alt="Profile Image"
          width={100}
          height={100}
          className="object-cover rounded-full w-28 h-28 border-2 border-gray-300"
        />
        {/* Admin Badge */}
        {user?.role === "admin" && (
          <div className="text-blue-50 bg-blue-600 text-sm text-center font-medium p-1 px-3 rounded shadow-lg my-3">
            Admin
          </div>
        )}
        <h5 className="text-lg font-semibold text-gray-700">
          {user?.name || " "}
        </h5>
        <p className="text-sm text-gray-500">{user?.email || " "}</p>
      </div>

      {/* Sidebar Menu */}
      <div className="flex flex-col items-start justify-start my-8">
        {sideMenuData.map((item, index) => (
          <button
            key={index}
            className={`w-full flex items-center gap-4 text-base font-medium
                        ${
                          isActive
                            ? "bg-blue-200 text-blue-600"
                            : " text-gray-600"
                        }

                        hover:bg-blue-100 hover:text-blue-500 border-r-2 hover:border-blue-600 py-4 px-8 transition-all cursor-pointer`}
            onClick={() => handleClick(item.path)}
          >
            {item.icon} {" "}
            {item.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
