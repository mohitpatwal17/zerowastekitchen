"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { MobileDrawer } from "@/components/layout/MobileDrawer";
import { cn } from "@/lib/utils";

// Wait, I check my imports in layout.tsx to make sure I get them right.
// I'll use a simpler ClientLayout that just wraps the content and uses the hooks.

import { Menu, Sparkles } from "lucide-react";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full relative bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Desktop Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-h-screen w-full">
        {/* Header (Tablet/Mobile) */}
        <header className="lg:hidden h-16 px-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 z-30">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu size={24} className="text-slate-600 dark:text-slate-400" />
          </button>
          
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            <span className="font-black tracking-tighter uppercase italic dark:text-white">CrumbIQ</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800" />
        </header>

        <main className="flex-1 lg:ml-64 pb-24 lg:pb-10 transition-all duration-300">
          <div className="h-full p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <BottomNav onMoreClick={() => setIsDrawerOpen(true)} />
      
      <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  );
}
