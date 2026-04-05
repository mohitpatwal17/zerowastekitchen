"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, ShoppingCart, UtensilsCrossed, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", icon: Home, href: "/dashboard" },
  { label: "Inventory", icon: Package, href: "/inventory" },
  { label: "Shopping", icon: ShoppingCart, href: "/shopping" },
  { label: "Planner", icon: UtensilsCrossed, href: "/planner" },
];

export function BottomNav({ onMoreClick }: { onMoreClick: () => void }) {
  const pathname = usePathname();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 px-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between h-16 max-w-lg mx-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 gap-1 transition-colors",
                isActive ? "text-emerald-600 dark:text-emerald-500" : "text-slate-500 dark:text-slate-400"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "animate-in zoom-in duration-300")} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
        <button
          onClick={onMoreClick}
          className="flex flex-col items-center justify-center flex-1 gap-1 text-slate-500 dark:text-slate-400"
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[10px] font-medium">More</span>
        </button>
      </div>
    </div>
  );
}
