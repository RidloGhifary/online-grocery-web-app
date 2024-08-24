import type { Metadata } from "next";
import { Nunito } from "next/font/google";

import { ToastContainer } from "react-toastify";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";

import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const font = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Online Grocery Store",
  description: "Online Grocery Store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <ToastContainer />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
