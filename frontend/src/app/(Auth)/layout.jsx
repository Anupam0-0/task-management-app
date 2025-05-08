import React from "react";

const layout = ({ children }) => {
  return (
    <div className="h-screen w-full p-2 bg-white">
      <header className="py-2 w-full text-center bg-neutral-950 text-white/90 place-content-center fixed left-0 top-0 shadow-2xl">
        Since the backend is deployed in free tier service. Please wait 1-2 min
        for cold start.
      </header>

      <main className="flex h-full rounded-2xl border-2 border-neutral-950 shadow-2xl overflow-hidden ">
        <section
          className="w-full lg:w-1/2 flex flex-col items-center justify-center h-full bg-neutral-50 text-neutral-950">
          {children}
        </section>
        <section className="w-full hidden lg:flex lg:w-1/2 flex-col items-center justify-center h-full bg-neutral-50 text-neutral-950">
        </section>
      </main>
    </div>
  );
};

export default layout;
