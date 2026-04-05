import { Loader2, PackageOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export function LoadingState({ message = "Loading...", className }: { message?: string, className?: string }) {
  return (
    <div className={cn("w-full py-20 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400", className)}>
      <Loader2 className="w-8 h-8 animate-spin mb-4 text-emerald-500" />
      <p className="font-medium animate-pulse">{message}</p>
    </div>
  );
}

export function EmptyState({ 
  title = "No data found", 
  description = "Get started by adding some items.", 
  icon = <PackageOpen className="w-12 h-12" />,
  action,
  className 
}: { 
  title?: string, 
  description?: string, 
  icon?: React.ReactNode, 
  action?: React.ReactNode,
  className?: string
}) {
  return (
    <div className={cn("w-full py-20 flex flex-col items-center justify-center text-center px-4", className)}>
      <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-6 border border-slate-200 dark:border-slate-700">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8">{description}</p>
      {action}
    </div>
  );
}
