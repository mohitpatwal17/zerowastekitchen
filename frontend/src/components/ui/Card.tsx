import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export function Card({ className, glass, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border transition-all duration-300",
        glass 
          ? "bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border-white/20 dark:border-slate-800/50" 
          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800",
        "hover:scale-[1.02] hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-emerald-500/5",
        className
      )}
      {...props}
    />
  );
}
