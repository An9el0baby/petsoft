import Logo from "@/components/logo";
import React from "react";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen gap-y-5">
      <Logo />
      {children}
    </div>
  );
}
