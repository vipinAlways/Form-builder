"use client";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
} from "./ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { LibraryIcon, LucideCreativeCommons } from "lucide-react";

const SideNav = () => {
  const session = useSession()
  if(!session || !session.data || !session.data.user) return null
  
  return (
    <Sidebar className="w-fit "  >
      <SidebarHeader className="text-sidebar-accent-foreground">
        <Link
          href={"/"}
          className="flex items-center gap-4 border-b-2 pt-2 pb-4"
        >
          <p className="text-2xl font-semibold">Your Form </p>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="border-b-2 pt-2 pb-4">
              <div className="flex flex-col gap-4">
                <div className="flex gap-4 items-center">
                  <Image
                    src={session.data?.user.image?.trim() ? session.data.user.image : "/nouserImage.webp"}
                    height={30}
                    width={30}
                    alt="userImage"
                    className="rounded-full object-cover"
                  />
                  <Link
                    href={`/user/${session.data.user.email}`}
                    className="text-xl font-medium"
                  >
                    {session.data.user.name}
                  </Link>
                </div>
              </div>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col items-start">
             <Link href={"/create-form"} className="flex items-center gap-3 text-lg sm:text-xl hover:bg-zinc-500/50 hover:border-zinc-800 w-full rounded-lg py-3 px-2"><LucideCreativeCommons/> Create Form</Link>
             <Link href={"/Your-form"}   className="flex items-center gap-3 text-lg sm:text-xl hover:bg-zinc-500/50 hover:border-zinc-800 w-full rounded-lg py-3 px-2"><LibraryIcon/>Your Form</Link>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="text-zinc-100">
        <Button onClick={() => signOut()}>Log out</Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SideNav;
