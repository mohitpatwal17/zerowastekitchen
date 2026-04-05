"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  Trash2, 
  ShoppingCart, 
  BarChart3, 
  Lightbulb, 
  Utensils,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Inventory", icon: Package, href: "/inventory" },
  { label: "Waste Log", icon: Trash2, href: "/waste" },
  { label: "Shopping", icon: ShoppingCart, href: "/shopping" },
  { label: "Analytics", icon: BarChart3, href: "/analytics" },
  { label: "Insights", icon: Lightbulb, href: "/insights" },
  { label: "Planner", icon: Utensils, href: "/planner" },
];

export function Sidebar({ isOpen, onClose }: { isOpen?: boolean, onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"
          />
        )}
      </AnimatePresence>

      <aside className={cn(
        "fixed left-0 top-0 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 z-[70] flex flex-col w-64",
        "lg:translate-x-0", // Always visible on desktop
        isOpen ? "translate-x-0" : "-translate-x-full" // Mobile drawer state
      )}>
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="font-black text-xl tracking-tighter text-slate-900 dark:text-white uppercase italic">CrumbIQ</span>
          </div>
          
          <button onClick={onClose} className="lg:hidden p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto pt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={onClose}>
                <div className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                  isActive 
                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" 
                    : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900"
                )}>
                  <item.icon className={cn(
                    "w-5 h-5 shrink-0 transition-transform group-hover:scale-110",
                    isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"
                  )} />
                  <span className="text-sm font-bold">{item.label}</span>
                  {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <Link href="/profile" onClick={onClose}>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                      <User size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">Mohit Patwal</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase truncate">Eco Warrior</p>
                  </div>
              </div>
          </Link>
          <div className="flex items-center gap-2">
              <Link href="/preferences" onClick={onClose} className="flex-1">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <Settings className="w-5 h-5 text-slate-400" />
                      <span className="text-sm font-bold text-slate-500">Settings</span>
                  </div>
              </Link>
              <ThemeToggle />
          </div>
        </div>
      </aside>
    </>
  );
}
