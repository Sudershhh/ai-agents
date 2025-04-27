"use client";
import { Authenticated } from "convex/react";
import React from "react";
import Header from "@/components/Header";
import NavigationProvider from "@/lib/NavigationProvider";
import Sidebar from "@/components/Sidebar";

function Dashboardlayout({ children }: { children: React.ReactNode }) {
  return (
    <NavigationProvider>
      <div className="flex h-screen">
        <Authenticated>
          <Sidebar />
        </Authenticated>

        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </NavigationProvider>
  );
}

export default Dashboardlayout;
