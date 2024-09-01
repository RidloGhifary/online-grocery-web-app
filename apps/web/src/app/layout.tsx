import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { ToastContainer } from "react-toastify";

import QueryProvider from "./provider";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";
import { UserProps } from "@/interface/user";

import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { CartProvider } from "@/context/CartContext";

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
        <QueryProvider>
          <CartProvider>
            <ToastContainer />
            <Navbar user={user as UserProps} />
            <main>{children}</main>
            <Footer />
          </CartProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
