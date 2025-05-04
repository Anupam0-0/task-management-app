"use client";

import { redirect } from "next/navigation";
import React, { useEffect } from "react";

const Page = () => {
  useEffect(() => {
    const ticket = localStorage.getItem("ticket");
    if (ticket) {
      redirect("/");
    } else {
      redirect("/login");
    }
  }, []);

  return (
    <div className="p-10 flex flex-col gap-10">
      <div>This aint your page, so will sone be redirected</div>

    </div>
  );
};

export default Page;
