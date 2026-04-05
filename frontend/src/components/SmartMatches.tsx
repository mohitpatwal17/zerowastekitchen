"use client";

import { useEffect, useState } from "react";
import { Sparkles, ArrowRight, Clock, Leaf, Info } from "lucide-react";
import { useLocalization } from "@/lib/LocalizationContext";
import { motion } from "framer-motion";
import { apiFetch } from "@/lib/api";

interface Recipe {
    title: string;
    ingredients: string[];
    time_minutes: number;
    rescuing_items: string[];
    is_veg: boolean;
    waste_explanation: string;
}

interface SmartMatchesProps {
    onSelect: (dishName: string) => void;
    cuisine?: string;
}

export function SmartMatches({ onSelect, cuisine }: SmartMatchesProps) {
    const { t } = useLocalization();
    const [matches, setMatches] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatches = async () => {
            setLoading(true);
            try {
                const data = await apiFetch("/planner/consult", {
                    method: "POST",
                    body: JSON.stringify({
                        dietary_preference: "both",
                        max_time_minutes: 60,
                        cuisine: cuisine
                    })
                });
                setMatches(data);
            } catch (err) {
                console.error("Failed to fetch matches", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, [cuisine]);

    if (loading) return (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {[1, 2].map(i => (
                <div key={i} className="min-w-[280px] h-48 bg-gray-100 rounded-[2.5rem] animate-pulse" />
            ))}
        </div>
    );

    if (matches.length === 0) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-sm font-heading text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles size={18} className="text-amber-500 shadow-sm" />
                    {t('smartMatches')}
                </h3>
                <span className="text-[9px] text-emerald-600 font-black bg-emerald-50/50 border border-emerald-100/50 px-3 py-1 rounded-full uppercase tracking-widest">
                    Zero Waste AI
                </span>
            </div>

            <div className="flex gap-5 overflow-x-auto pb-6 scrollbar-hide px-1">
                {matches.map((match, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.15, duration: 0.6 }}
                        whileHover={{ y: -8, scale: 1.02 }}
                        className="min-w-[290px] glass-panel p-6 rounded-[2.5rem] border-white/60 shadow-2xl shadow-slate-200/40 flex flex-col gap-5 relative overflow-hidden group/card"
                    >
                        {/* Interactive Background Glow */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover/card:bg-emerald-200/30 transition-all duration-1000"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-100/10 rounded-full -ml-12 -mb-12 blur-2xl group-hover/card:bg-blue-200/20 transition-all duration-1000"></div>

                        <div className="flex justify-between items-start z-10 relative">
                            <div className="space-y-1.5">
                                <h4 className="font-heading text-slate-900 text-xl leading-[1.2] group-hover/card:text-emerald-700 transition-colors uppercase tracking-tight">
                                    {match.title}
                                </h4>
                                <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                    <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-0.5 rounded-lg"><Clock size={12} className="text-slate-300" /> {match.time_minutes} min</span>
                                    {match.is_veg && <span className="flex items-center gap-1.5 text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100/50"><Leaf size={12} /> VEG</span>}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/40 backdrop-blur-sm rounded-[1.75rem] p-4 border border-white/60 z-10 shadow-sm">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">
                                {t('rescueIngredients')}
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                                {match.rescuing_items.map((item, idx) => (
                                    <span key={idx} className="text-[10px] font-black text-emerald-700 bg-emerald-50/80 px-2.5 py-1 rounded-xl shadow-sm border border-emerald-100/50">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* AI Logic Leak (Explainability) */}
                        <div className="px-1 space-y-2 z-10 relative">
                            <div className="flex items-center gap-2 text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em]">
                                <Info size={14} className="opacity-80" /> AI Optimization Logic
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium italic leading-relaxed border-l-2 border-emerald-500/20 pl-3 py-1">
                                {match.waste_explanation || "Optimization based on inventory freshness and regional preference."}
                            </p>
                        </div>

                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onSelect(match.title)}
                            className="mt-2 w-full py-4.5 bg-slate-900 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 group/btn hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200/50 active:shadow-inner"
                        >
                            {t('planMeal')}
                            <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                        </motion.button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
