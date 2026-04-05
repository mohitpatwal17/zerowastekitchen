"use client";

import { motion } from "framer-motion";
import { Clock, Leaf, Play, Info } from "lucide-react";

interface Recipe {
    title: string;
    time_minutes: number;
    co2_saved: number;
    rescuing_items: string[];
    image_url: string;
    is_veg: boolean;
    waste_explanation: string;
    instructions: string[];
}

export function RescueCard({ recipe }: { recipe: Recipe }) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group cursor-pointer"
        >
            <div className="h-40 bg-gray-200 relative overflow-hidden">
                <img src={recipe.image_url} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

                {/* Veg/Non-Veg Badge */}
                <div className={`absolute top-3 right-3 w-6 h-6 rounded-md flex items-center justify-center border-2 ${recipe.is_veg ? 'border-emerald-500' : 'border-red-500'}`}>
                    <div className={`w-2 h-2 rounded-full ${recipe.is_veg ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                </div>

                <div className="absolute top-3 left-3 bg-amber-100/90 backdrop-blur-sm text-amber-800 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm uppercase tracking-wider">
                    <Leaf size={12} className="text-amber-600" /> Rescuing {recipe.rescuing_items.length} Items
                </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
                <div className="mb-4">
                    <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">AI Suggestion</span>
                    </div>
                    <h4 className="font-black text-gray-900 text-lg leading-tight mb-2 group-hover:text-emerald-700 transition-colors">{recipe.title}</h4>

                    <div className="flex gap-2 flex-wrap mb-3">
                        {recipe.rescuing_items.map((item, idx) => (
                            <span key={idx} className="bg-gray-100 text-gray-600 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase">
                                {item}
                            </span>
                        ))}
                    </div>

                    <div className="bg-emerald-50 p-2.5 rounded-xl flex gap-2 items-start mb-4">
                        <Info size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-emerald-800 font-medium leading-relaxed italic">
                            &quot;{recipe.waste_explanation}&quot;
                        </p>
                    </div>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 font-bold text-gray-400">
                            <Clock size={14} /> {recipe.time_minutes} min
                        </div>
                        <div className="flex items-center gap-1 text-emerald-600 font-bold">
                            <Leaf size={14} /> {recipe.co2_saved}kg CO2e
                        </div>
                    </div>
                    <button className="bg-gray-900 text-white p-2 rounded-xl hover:bg-emerald-600 transition-colors shadow-lg">
                        <Play size={14} fill="white" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

