"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { api } from "@/lib/api";
import { ShoppingCart, Plus, Sparkles, CheckCircle2, Circle, Trash2, ArrowRight, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function ShoppingPage() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [smartLoading, setSmartLoading] = useState(false);

  useEffect(() => {
    fetchShoppingList();
  }, []);

  const fetchShoppingList = async () => {
    setLoading(true);
    try {
      const data = await api.shopping.get();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (item: any) => {
    const newStatus = !item.is_purchased;
    try {
        await api.shopping.updateItem(item.id, { is_purchased: newStatus });
        setItems(items.map(i => i.id === item.id ? { ...i, is_purchased: newStatus } : i));
    } catch (err) {
        console.error(err);
    }
  };

  const handleSmartGenerate = async () => {
      setSmartLoading(true);
      try {
          await api.shopping.generateSmart();
          fetchShoppingList();
      } catch (err) {
          console.error(err);
      } finally {
          setSmartLoading(false);
      }
  };

  if (loading) return <ShoppingSkeleton />;

  const pendingItems = items.filter(i => !i.is_purchased);
  const completedItems = items.filter(i => i.is_purchased);

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Shopping List</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Smart replenishment for a zero-waste kitchen.</p>
        </div>
        <Button onClick={handleSmartGenerate} isLoading={smartLoading} className="bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20">
          <Sparkles className="w-5 h-5 mr-2" />
          Auto-Fill Staples
        </Button>
      </div>

      {/* Summary */}
      <Card className="p-6 bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0 shadow-xl shadow-emerald-500/20 overflow-hidden relative">
          <div className="relative z-10 flex items-center justify-between">
              <div>
                  <h3 className="text-2xl font-black">{pendingItems.length} Items Remaining</h3>
                  <p className="text-emerald-100 font-bold text-sm">Saving you from extra grocery trips.</p>
              </div>
              <ShoppingCart className="w-16 h-16 opacity-20 -rotate-12" />
          </div>
      </Card>

      {/* List Sections */}
      <div className="space-y-6">
          {/* Pending Items */}
          <div className="space-y-3">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 px-2 flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-emerald-500" />
                  To Buy
              </h2>
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {pendingItems.map((item) => (
                    <ShoppingItemRow key={item.id} item={item} onToggle={() => handleToggle(item)} />
                  ))}
                </AnimatePresence>
                {pendingItems.length === 0 && (
                     <div className="p-10 text-center border-2 border-dashed rounded-3xl text-slate-400 font-bold">
                         List is empty. Use "Auto-Fill" to see AI suggestions!
                     </div>
                )}
              </div>
          </div>

          {/* Completed Items */}
          {completedItems.length > 0 && (
            <div className="space-y-3 pt-4">
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 px-2 flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-slate-300" />
                    Recently Purchased
                </h2>
                <div className="space-y-2 opacity-60 grayscale-[0.5]">
                    {completedItems.map((item) => (
                        <ShoppingItemRow key={item.id} item={item} onToggle={() => handleToggle(item)} />
                    ))}
                </div>
            </div>
          )}
      </div>

      {/* Add Manual Item FAB (Mobile) or Footer Button */}
      <div className="pt-4">
          <Button variant="outline" size="lg" className="w-full rounded-2xl border-dashed py-6 border-2 hover:bg-slate-50">
              <Plus className="w-5 h-5 mr-2" />
              Add Custom Item
          </Button>
      </div>
    </div>
  );
}

function ShoppingItemRow({ item, onToggle }: any) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className={cn(
                "group flex items-center justify-between p-4 rounded-2xl border transition-all",
                item.is_purchased 
                    ? "bg-slate-50 dark:bg-slate-800/20 border-slate-100 dark:border-slate-800" 
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-500/50"
            )}
        >
            <div className="flex items-center gap-4">
                <button 
                    onClick={onToggle}
                    className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center transition-colors",
                        item.is_purchased ? "bg-emerald-500 text-white" : "border-2 border-slate-200 dark:border-slate-700 text-transparent hover:border-emerald-500"
                    )}
                >
                    <CheckCircle2 className="w-4 h-4" />
                </button>
                <div>
                    <h4 className={cn("font-bold text-slate-900 dark:text-white transition-all", item.is_purchased && "line-through opacity-50")}>
                        {item.name}
                    </h4>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                        {item.quantity} • {item.category}
                    </p>
                </div>
            </div>
            
            <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-red-500">
                <Trash2 className="w-4 h-4" />
            </button>
        </motion.div>
    );
}

function ShoppingSkeleton() {
    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-32 w-full rounded-3xl" />
            <div className="space-y-4">
                <Skeleton className="h-16 w-full rounded-2xl" />
                <Skeleton className="h-16 w-full rounded-2xl" />
                <Skeleton className="h-16 w-full rounded-2xl" />
            </div>
        </div>
    );
}
