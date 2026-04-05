import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "success" | "warning" | "danger" | "info" | "neutral";
  pulse?: boolean;
}

export function Badge({ className, variant = "neutral", pulse, ...props }: BadgeProps) {
  const variants = {
    success: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50",
    warning: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50",
    danger: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50",
    info: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50",
    neutral: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border transition-colors",
        variants[variant],
        pulse && variant === "danger" && "animate-pulse",
        className
      )}
      {...props}
    />
  );
}
