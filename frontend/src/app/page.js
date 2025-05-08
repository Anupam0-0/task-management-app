"use client";
import React from "react";
import Link from "next/link";
import { useUser } from "@/context/userContext";
import { useRouter } from "next/navigation";

const Page = () => {
  const { user } = useUser();
  const router = useRouter();

  if (!user) {
    router.push("/login");
  }

  return (
    <div>
      <p>You are not logged in.</p>
      <Link href="/login">Go to login</Link>
    </div>
  );
};

export default Page;
