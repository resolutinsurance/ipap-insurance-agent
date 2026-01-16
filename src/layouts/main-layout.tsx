"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { Header, InnerHeader } from "@/components/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import WidthConstraint from "@/components/ui/width-constraint";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-screen overflow-clip bg-background">
        <AppSidebar />
        <div
          className={cn(
            "flex flex-col flex-1 transition-all overflow-x-auto duration-300 ease-in-out"
          )}
        >
          <Header />
          <WidthConstraint className="w-full h-[calc(100vh-55px)] overflow-y-auto">
            <InnerHeader />
            <main className="flex-1 h-[calc(100vh-200px)]">{children}</main>
          </WidthConstraint>
        </div>
      </div>
    </SidebarProvider>
  );
}
