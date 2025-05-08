import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import UserProvider from "@/context/userContext";

const interFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Task Management",
  description:
    "A Full-Stack Task Management Application made with MERN Stack with dashboard, report downloads, attachments upport, and more.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${interFont.variable} antialiased dark`}
      >
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
