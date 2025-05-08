import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <div className="h-20 px-max flex items-center justify-start gap-6 bg-neutral-100 text-black border-b border-gray-300 ">
      <h1 className="text-3xl font-bold">Task Management </h1>
    </div>
  );
};

export default Navbar;
