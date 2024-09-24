import { getCurrentUser } from "@/actions/getCurrentUser";
import Footer from "@/components/Footer";
import Navbar from "@/components/navbar/Navbar";
import { UserProps } from "@/interfaces/user";
import { ReactNode } from "react";

export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <>
      <Navbar user={user as UserProps} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
