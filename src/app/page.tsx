"use client"
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";

const page = () => {
  const session = useSession();

  
  return <div>page</div>;
};

export default page;
