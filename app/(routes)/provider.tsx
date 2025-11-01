"use client";

import React, { useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import axios from "axios";
import AppHeader from "../_components/AppHeader";
import { AppSidebar } from "../_components/AppSidebar";

function DashboardProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    // Create or sync user when provider mounts
    const createNewUser = async () => {
      try {
        const userData = {
          email: "test@example.com",
          name: "Test User",
        };

        const result = await axios.post("/api/user", userData);
        console.log("✅ User synced:", result.data);
      } catch (error) {
        console.error("❌ Error creating user:", error);
      }
    };

    createNewUser();
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <AppHeader />
        <div className="p-10">{children}</div>
      </main>
    </SidebarProvider>
  );
}

export default DashboardProvider;
