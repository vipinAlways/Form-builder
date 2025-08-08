"use client";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

const page = () => {
  const session = useSession();
  const isMobile = useIsMobile();
  if (!session || !session.data?.user || !session.data.user?.image) return null;
  return (
    <div className="p-4">
      <SidebarTrigger className="sm:hidden" />
      <div className="flex items-start gap-3 flex-col">
        <h1 className="sm:text-5xl font-bold">Hello,</h1>
        <div className="font-semibold sm:text-5xl flex items-center gap-4">
          {/* <Image
            src={session.data?.user?.image}
            alt="useriamge"
            height={isMobile ? 30 : 60}
            width={isMobile ? 30 : 60}
            className="rounded-full object-cover"
          /> */}
          <h1>{session.data?.user?.name}</h1>

          <p></p>
        </div>
      </div>

      <div>
        
      </div>
    </div>
  );
};

export default page;
