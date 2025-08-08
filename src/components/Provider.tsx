"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { useState, useEffect } from "react";
import { SidebarProvider } from "./ui/sidebar";

const Provider = ({ children }: { children: React.ReactNode }) => {
  const [mount, setMount] = useState<boolean>(false);
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => setMount(true), [mount]);

  if (!mount) return null;
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <SidebarProvider>{children}</SidebarProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
};

export default Provider;
