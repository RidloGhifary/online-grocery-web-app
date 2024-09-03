import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import Script from "next/script";
import { ToastContainer } from "react-toastify";

import QueryProvider from "./provider";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";
import { UserProps } from "@/interfaces/user";

import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import { getCurrentUser } from "@/actions/getCurrentUser";
import Marquee from "@/components/Marquee";

const font = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Online Grocery Store",
  description: "Online Grocery Store",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body className={font.className}>
        <Script
          strategy="beforeInteractive"
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        />
        <QueryProvider>
            <ToastContainer position="top-center" draggable={true} />
            <Marquee />
            <Navbar user={user as UserProps} />
            <main>{children}</main>
            <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
