"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Item {
    id: number;
    name: string;
    quantity: string;
    category: string;
    expiry_date: string;
    risk_score: number;
    risk_status: string;
    risk_explanation: string;
    is_leftover: boolean;
}

import { useLocalization } from "@/lib/LocalizationContext";
import { Info, Droplets, Leaf } from "lucide-react";

export function InventoryTable({ items }: { items: Item[] }) {
    const { t } = useLocalization();

    const getLocalizedRiskStatus = (status: string) => {
        switch (status) {
            case "Critical": return t('critical');
            case "High": return t('highRisk');
            case "Medium": return t('medRisk');
            default: return t('lowRisk');
        }
    };

    const getLocalizedTimeLeft = (score: number) => {
        if (score > 90) return `12 ${t('hoursLeft')}`;
        if (score > 80) return `1 ${t('dayLeft')}`;
        if (score > 50) return `3 ${t('daysLeft')}`;
        return `7 ${t('daysLeft')}`;
    };

    return (
        <div className="space-y-4">
            {items.map((item, index) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08, duration: 0.6, ease: "easeOut" }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="glass-panel p-5 rounded-[2.5rem] border-white/60 shadow-xl shadow-slate-200/10 glass-card-hover group relative overflow-hidden"
                >
                    <div className="flex items-center gap-5 relative z-10">
                        {/* High-End Image Aperture */}
                        <div className="relative w-16 h-16 rounded-[1.5rem] overflow-hidden bg-slate-50 border border-slate-100/50 shrink-0 shadow-inner group-hover:shadow-emerald-100/50 transition-all duration-500">
                            <img
                                src={
                                    item.name.includes("Spinach") ? "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=150&q=80" :
                                        item.name.includes("Milk") ? "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=150&q=80" :
                                            "https://images.unsplash.com/photo-1587393855524-087f83d95bc9?auto=format&fit=crop&w=150&q=80"
                                }
                                className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                                alt={item.name}
                            />
                            {/* Animated Risk Aura */}
                            <div className={cn(
                                "absolute top-1.5 right-1.5 w-3 h-3 rounded-full border-2 border-white shadow-lg animate-pulse",
                                item.risk_score > 80 ? "bg-red-500 shadow-red-200" :
                                    item.risk_score > 50 ? "bg-amber-500 shadow-amber-200" : "bg-emerald-500 shadow-emerald-200"
                            )} />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-heading text-slate-900 text-base truncate leading-none items-center flex gap-1.5 ring-offset-glass">
                                    {item.name}
                                    {item.is_leftover && (
                                        <span className="bg-amber-100/60 backdrop-blur-sm text-[8px] font-black px-2 py-0.5 rounded-full text-amber-700 flex items-center gap-1 border border-amber-200/50 tracking-widest uppercase">
                                            REMIX
                                        </span>
                                    )}
                                </h4>
                            </div>

                            <div className="flex items-center gap-2.5">
                                <span className={cn(
                                    "text-[9px] font-black px-2 py-0.5 rounded-lg border tracking-[0.1em] uppercase",
                                    item.risk_score > 80 ? "bg-red-50 border-red-100 text-red-600" :
                                        item.risk_score > 50 ? "bg-amber-50 border-amber-100 text-amber-600" : "bg-emerald-50 border-emerald-100 text-emerald-600"
                                )}>
                                    {getLocalizedRiskStatus(item.risk_status)}
                                </span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.quantity}</span>
                            </div>
                        </div>

                        <div className="text-right shrink-0">
                            <span className={cn(
                                "text-[10px] font-black uppercase block tracking-[0.15em] mb-1",
                                item.risk_score > 80 ? "text-red-500" :
                                    item.risk_score > 50 ? "text-amber-500" : "text-emerald-500"
                            )}>
                                {getLocalizedTimeLeft(item.risk_score)}
                            </span>
                            <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden ml-auto">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, item.risk_score)}%` }}
                                    className={cn(
                                        "h-full rounded-full transition-all duration-1000",
                                        item.risk_score > 80 ? "bg-red-400" : item.risk_score > 50 ? "bg-amber-400" : "bg-emerald-400"
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Environmental Blueprint (Tier 3 - Feature 8) */}
                    <div className="mt-5 pt-4 border-t border-slate-50 flex gap-3 text-[9px] font-bold uppercase tracking-widest relative z-10">
                        <span className="text-blue-500 bg-blue-50/20 px-3 py-1 rounded-xl flex items-center gap-1.5 border border-blue-100/30">
                            <Droplets size={12} className="opacity-70" /> {item.category === "Meat" ? "1,500L" : item.category === "Produce" ? "80L" : "210L"} Water
                        </span>
                        <span className="text-slate-500 bg-slate-50/30 px-3 py-1 rounded-xl flex items-center gap-1.5 border border-slate-100/50">
                            <Leaf size={12} className="opacity-70" /> {item.category === "Meat" ? "2.5kg" : item.category === "Produce" ? "0.2kg" : "0.5kg"} CO2e
                        </span>
                    </div>

                    {/* Explainable AI Telemetry (Roadmap Feature 2) */}
                    {item.risk_explanation && (
                        <div className="mt-4 p-4 bg-slate-50/50 backdrop-blur-sm rounded-2xl border border-slate-100/30 flex items-start gap-3 group-hover:bg-white transition-colors duration-500">
                            <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                                <Info size={14} />
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">
                                {item.risk_explanation}
                            </p>
                        </div>
                    )}
                </motion.div>
            ))}
        </div>
    );
}

