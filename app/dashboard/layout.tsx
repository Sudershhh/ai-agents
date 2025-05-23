"use client";
import { Authenticated } from "convex/react";
import React from "react";
import NavigationProvider from "@/lib/NavigationProvider";
import Sidebar from "@/components/Sidebar";

function Dashboardlayout({ children }: { children: React.ReactNode }) {
  return (
    <NavigationProvider>
      <Authenticated>
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </div>
      </Authenticated>
    </NavigationProvider>
  );
}

export default Dashboardlayout;
