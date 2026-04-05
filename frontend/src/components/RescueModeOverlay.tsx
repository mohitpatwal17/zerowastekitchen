"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Zap, HandHeart, Snowflake, ArrowRight, X } from "lucide-react";

interface Item {
    id: number;
    name: string;
    risk_score: number;
}

interface RescueModeOverlayProps {
    criticalItems: Item[];
    onClose: () => void;
    isVisible: boolean;
}

export function RescueModeOverlay({ criticalItems, onClose, isVisible }: RescueModeOverlayProps) {
    if (!isVisible || criticalItems.length < 3) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-red-950/90 backdrop-blur-md flex items-end sm:items-center justify-center p-4 lg:p-0"
            >
                <motion.div
                    initial={{ y: 200, scale: 0.9, opacity: 0 }}
                    animate={{ y: 0, scale: 1, opacity: 1 }}
                    exit={{ y: 200, scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="bg-white w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl shadow-red-500/20 relative"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 z-20 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="bg-red-600 p-8 pt-12 text-white relative">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Zap size={120} />
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                            <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
                                <AlertCircle size={18} className="text-white" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-red-100">Urgency Level: Critical</span>
                        </div>

                        <h2 className="text-4xl font-black leading-[0.9] uppercase tracking-tighter">
                            Rescue Mode<br />Activated
                        </h2>
                        <p className="text-red-100 font-bold text-sm mt-4 leading-relaxed max-w-[280px]">
                            Wait! {criticalItems.length} items are hitting the expiry wall in less than 24 hours.
                        </p>
                    </div>

                    <div className="p-8 space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Zap size={14} className="text-amber-500" /> Immediate Life-Savers
                            </h3>

                            {/* Action 1: Emergency Meal */}
                            <motion.div
                                whileHover={{ x: 5 }}
                                className="flex gap-4 group cursor-pointer p-4 rounded-2xl border border-transparent hover:border-amber-100 hover:bg-amber-50 transition-all"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all">
                                    <Zap size={24} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900 text-sm">Emergency &quot;Everything&quot; Stir-Fry</h4>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide mt-0.5">AI Recommendation • 15 min</p>
                                </div>
                                <ArrowRight className="text-gray-300 self-center group-hover:text-amber-600 group-hover:translate-x-1 transition-all" size={20} />
                            </motion.div>

                            {/* Action 2: Freeze */}
                            <motion.div
                                whileHover={{ x: 5 }}
                                className="flex gap-4 group cursor-pointer p-4 rounded-2xl border border-transparent hover:border-blue-100 hover:bg-blue-50 transition-all"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <Snowflake size={24} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900 text-sm">Bulk Freeze Protection</h4>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide mt-0.5">Preservation • 5 min</p>
                                </div>
                                <ArrowRight className="text-gray-300 self-center group-hover:text-blue-600 group-hover:translate-x-1 transition-all" size={20} />
                            </motion.div>

                            {/* Action 3: Donate */}
                            <motion.div
                                whileHover={{ x: 5 }}
                                className="flex gap-4 group cursor-pointer p-4 rounded-2xl border border-transparent hover:border-emerald-100 hover:bg-emerald-50 transition-all"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                    <HandHeart size={24} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900 text-sm">Donate to Nearby Food Bank</h4>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide mt-0.5">Social Impact • Robin Hood Army</p>
                                </div>
                                <ArrowRight className="text-gray-300 self-center group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" size={20} />
                            </motion.div>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full py-5 bg-gray-900 text-white rounded-[2rem] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl shadow-slate-200 active:scale-95 mt-4"
                        >
                            Got it, I&apos;m on it!
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
