"use client";

import { useState, useEffect } from "react";
import { Users, Info, CheckCircle2, AlertCircle, Scale, ShoppingBag, ScrollText, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocalization } from "@/lib/LocalizationContext";
import { apiFetch } from "@/lib/api";

interface IngredientCheck {
    name: string;
    required: string;
    available: string;
    status: string;
}

interface PortionPlannerProps {
    selectedDish?: string;
}

export function PortionPlanner({ selectedDish }: PortionPlannerProps) {
    const { t } = useLocalization();
    const [dish, setDish] = useState(selectedDish || "");
    const [people, setPeople] = useState(2);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);

    useEffect(() => {
        if (selectedDish) {
            setDish(selectedDish);
            // Trigger auto-calculate when selected from Smart Matches
            setTimeout(() => calculate(selectedDish), 100);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDish]);

    const calculate = async (targetDish?: string) => {
        const dishToQuery = targetDish || dish;
        if (!dishToQuery) return;

        setLoading(true);
        try {
            const data = await apiFetch("/planner/portion-check", {
                method: "POST",
                body: JSON.stringify({ dish_name: dishToQuery, num_people: people })
            });
            setResult(data);
            setShowInstructions(false);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const addToShoppingList = async () => {
        if (!result) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const missing = result.checks.filter((c: any) => c.status === "Missing");

        for (const item of missing) {
            try {
                await apiFetch("/shopping/add", {
                    method: "POST",
                    body: JSON.stringify({
                        name: item.name,
                        quantity: item.required,
                        category: "Goal: " + result.dish_name
                    })
                });
            } catch (err) {
                console.error("Failed to add to shopping list", err);
            }
        }
        alert(`Added ${missing.length} missing items to your shopping list!`);
    };
    return (
        <div className="glass-panel p-7 rounded-[3rem] shadow-2xl border-white/60 space-y-6 relative overflow-hidden group">

            {/* Background Ornaments */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/20 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-blue-200/30 transition-all duration-1000" />

            <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50/50 flex items-center justify-center text-blue-600 shadow-inner">
                        <Scale size={20} />
                    </div>
                    <div>
                        <h3 className="font-heading text-slate-900 text-lg leading-none tracking-tight">{t('portionPlanner')}</h3>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1.5">Precision Calibrator</p>
                    </div>
                </div>
                {result && (
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-[9px] font-black text-blue-600 bg-blue-50/80 border border-blue-100/50 px-3 py-1.5 rounded-full uppercase tracking-widest"
                    >
                        AI Synchronized
                    </motion.span>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-1">{t('selectDish')}</label>
                    <input
                        type="text"
                        placeholder={t('dishPlaceholder')}
                        value={dish}
                        onChange={(e) => setDish(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-100 text-slate-900 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/50 outline-none shadow-inner transition-all hover:bg-white"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-1">{t('people')}</label>
                    <div className="flex items-center bg-slate-50/50 border border-slate-100 rounded-2xl px-5 py-4 gap-4 shadow-inner hover:bg-white transition-all">
                        <Users size={20} className="text-slate-300" />
                        <input
                            type="number"
                            min="1"
                            max="20"
                            value={people}
                            onChange={(e) => setPeople(parseInt(e.target.value))}
                            className="bg-transparent border-none w-full text-sm font-black focus:outline-none text-slate-900"
                        />
                    </div>
                </div>
            </div>

            <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => calculate()}
                disabled={loading || !dish}
                className="w-full bg-slate-900 text-white font-black py-4.5 rounded-[1.5rem] hover:bg-blue-600 transition-all shadow-xl shadow-slate-200/50 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-40 uppercase tracking-[0.2em] text-[10px] relative z-10"
            >
                {loading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Scale size={18} /></motion.div>
                ) : t('analyzePortions')}
            </motion.button>

            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="space-y-6 pt-4 relative z-10"
                    >
                        <div className="p-5 bg-blue-50/40 backdrop-blur-sm rounded-[2rem] flex gap-4 border border-blue-100/50 shadow-sm shadow-blue-50">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                <Info size={18} />
                            </div>
                            <p className="text-[12px] text-blue-900 font-medium leading-relaxed italic">&quot;{result.suggestion}&quot;</p>
                        </div>

                        {/* Precise Shopping List */}
                        <div className="space-y-3">
                            <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('preciseShoppingList')}</h4>
                            <div className="space-y-2.5">
                                {result.checks.map((check: IngredientCheck, i: number) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm border border-slate-100 rounded-[1.5rem] shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-xl shadow-inner ${check.status === "Enough" ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                                {check.status === "Enough" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-slate-900 leading-none mb-1">{check.name}</p>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Target: {check.required}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-[9px] font-black uppercase tracking-widest ${check.status === "Enough" ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                {check.status === "Enough" ? "In Sync" : "Latent"}
                                            </span>
                                            <p className="text-[10px] text-slate-400 font-bold leading-none mt-1">{check.available}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={addToShoppingList}
                                className="flex-1 bg-slate-900 text-white rounded-2xl py-4 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200"
                            >
                                <ShoppingBag size={16} /> {t('addAllToShopping')}
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowInstructions(!showInstructions)}
                                className="bg-white border border-slate-200 text-slate-600 rounded-2xl px-5 py-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
                            >
                                <ScrollText size={16} />
                                {showInstructions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </motion.button>
                        </div>

                        <AnimatePresence>
                            {showInstructions && result.instructions && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100/50 space-y-4 shadow-inner mt-2">
                                        <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">{t('recipeInstructions')}</h4>
                                        <div className="space-y-4">
                                            {result.instructions.map((step: string, i: number) => (
                                                <div key={i} className="flex gap-4 items-start">
                                                    <span className="w-6 h-6 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 shrink-0 shadow-sm">{i + 1}</span>
                                                    <p className="text-[11px] text-slate-600 font-medium leading-relaxed italic">{step}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
