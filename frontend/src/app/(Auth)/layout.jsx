"use client"
import axiosInstance from "@/utils/axiosInstance";
import Image from "next/image";
import React from "react";


const layout = ({ children }) => {

  const checkBackend = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.get("/");
      alert(response.data); // Handle the response as needed
    } catch (error) {
      console.error("Error fetching data from backend:", error);
    }
  }


  return (
    <div className="h-screen w-full p-2 bg-white">
      <header className="py-2 w-full text-center bg-neutral-950 text-white/90 place-content-center fixed left-0 top-0 shadow-2xl">
        Since the backend is deployed in free tier service. Please wait 1-2 min
        for cold start. {" "}
        <button onClick={checkBackend} className="underline relative group cursor-pointer"> Click here <span className="absolute top-9 -right-2 w-80 opacity-0 group-hover:opacity-100 bg-neutral-900/90 shadow-xl/30  text-white/80 rounded-lg p-1 group-hover:block">you will receive "Hi" from Backend as alert</span></button>
      </header>

      <main className="flex h-full rounded-2xl border-2 border-neutral-950 shadow-2xl overflow-hidden ">
        <section className="w-full lg:w-1/2 flex flex-col items-center justify-center h-full bg-neutral-50 text-neutral-950">
          <div className="shadow">
            {children}
          </div>
        </section>
        <section className="w-full hidden lg:flex lg:w-1/2 flex-col items-center justify-center h-full bg-neutral-100 ">
          <Image src='/AuthWallpaper.png' height={500} width={800} className='object-cover' alt='auth' />
        </section>
      </main>
    </div>
  );
};

export default layout;
