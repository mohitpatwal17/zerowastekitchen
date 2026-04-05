"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Item {
    id: number;
    name: string;
    expiry_date: string;
    risk_score: number;
}

export function TimelineVisualizer({ items }: { items: Item[] }) {
    // Sort items by expiry date (only future ones)
    const sortedItems = [...items]
        .filter(i => i.expiry_date)
        .sort((a, b) => new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime());

    // Get next 7 days
    const today = new Date();
    const timelineDays = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(today.getDate() + i);
        return d;
    });

    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    const getDayName = (date: Date) => date.toLocaleDateString('en-US', { weekday: 'short' });

    return (
        <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/50 border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between mb-8">
                <div className="space-y-0.5">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Intelligence</h3>
                    <p className="text-sm font-black text-gray-900 uppercase tracking-tight">Expiry Timeline</p>
                </div>
                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase border border-emerald-100/50">Next 7 Days</span>
            </div>

            <div className="relative pt-4 pb-16">
                {/* Timeline Horizontal Line */}
                <div className="absolute top-6 left-0 right-0 h-[3px] bg-slate-50 rounded-full" />

                <div className="flex justify-between relative px-2">
                    {timelineDays.map((day, i) => {
                        const dayStr = formatDate(day);
                        const dayItems = sortedItems.filter(item => {
                            const itemDate = item.expiry_date ? item.expiry_date.split('T')[0] : "";
                            return itemDate === dayStr;
                        });

                        return (
                            <div key={i} className="flex flex-col items-center relative">
                                {/* Dot and Label */}
                                <div className="z-10 bg-white p-1 rounded-full">
                                    <div className={cn(
                                        "w-3 h-3 rounded-full border-2 border-white shadow-md transition-all duration-500",
                                        i === 0 ? "bg-emerald-500 scale-125" : "bg-slate-200",
                                        dayItems.length > 0 && i !== 0 ? "bg-amber-400" : ""
                                    )} />
                                </div>
                                <span className={cn(
                                    "text-[9px] font-black uppercase mt-3 tracking-tighter",
                                    i === 0 ? "text-emerald-600" : "text-gray-400"
                                )}>
                                    {i === 0 ? "Today" : getDayName(day)}
                                </span>

                                {/* Items Container */}
                                <div className="absolute top-16 flex flex-col items-center gap-1.5 w-[65px]">
                                    {dayItems.slice(0, 2).map((item, idx) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            transition={{ delay: idx * 0.1 + i * 0.05 }}
                                            className={cn(
                                                "w-full py-1.5 px-1 rounded-xl border shadow-sm text-center",
                                                item.risk_score > 80 ? "bg-red-50 border-red-100 text-red-700" :
                                                    item.risk_score > 50 ? "bg-amber-50 border-amber-100 text-amber-700" :
                                                        "bg-emerald-50 border-emerald-100 text-emerald-700"
                                            )}
                                        >
                                            <span className="text-[8px] font-black uppercase truncate block leading-none">
                                                {item.name}
                                            </span>
                                        </motion.div>
                                    ))}
                                    {dayItems.length > 2 && (
                                        <div className="w-5 h-5 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center">
                                            <span className="text-[8px] font-black text-slate-400">+{dayItems.length - 2}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
