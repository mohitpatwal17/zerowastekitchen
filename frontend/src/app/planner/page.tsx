"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { api } from "@/lib/api";
import { askAI, extractJSON } from "@/lib/ai";
import { Utensils, Zap, Users, Calculator, Sparkles, ChefHat, Timer, Flame, CheckCircle2, Info, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function PlannerPage() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"portion" | "remix">("portion");

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const data = await api.items.getAll();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Skeleton className="h-[600px] w-full rounded-2xl" />;

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">AI Culinary Lab</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Precision planning and creative recovery for your kitchen.</p>
        </div>
      </div>

      {/* Feature Tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl w-full sm:w-fit">
          <button 
            onClick={() => setActiveTab("portion")}
            className={cn(
                "flex-1 sm:flex-none px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                activeTab === "portion" ? "bg-white dark:bg-slate-800 text-emerald-600 shadow-md" : "text-slate-400 hover:text-slate-600"
            )}
          >
              Portion Engine
          </button>
          <button 
            onClick={() => setActiveTab("remix")}
            className={cn(
                "flex-1 sm:flex-none px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                activeTab === "remix" ? "bg-white dark:bg-slate-800 text-indigo-600 shadow-md" : "text-slate-400 hover:text-slate-600"
            )}
          >
              Remix Lab
          </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
          {activeTab === "portion" ? (
              <PortionPlanner items={items} />
          ) : (
              <RemixLab items={items} />
          )}
      </div>
    </div>
  );
}

function PortionPlanner({ items }: { items: any[] }) {
    const [people, setPeople] = useState(2);
    const [dish, setDish] = useState("");
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [aiError, setAiError] = useState<string | null>(null);

    const handlePlan = async () => {
        setLoading(true);
        setAiError(null);
        const prompt = `I want to cook "${dish || "a balanced meal"}" for ${people} people. Based on common kitchen staples, provide exact measurements for a zero-waste result. Return ONLY a JSON object with keys: tip (string, a 1-sentence tip), ingredients (array of {name, amount}).`;
        try {
            const resp = await askAI(prompt);
            setResult(extractJSON<{tip: string, ingredients: any[]}>(resp));
        } catch (e: any) {
            console.error(e);
            if (e.message.includes("API_KEY_REQUIRED")) setAiError("API_KEY_REQUIRED");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <Card className="p-8 border-emerald-500/20 bg-emerald-50/10">
                <div className="max-w-xl mx-auto space-y-8">
                    <div className="text-center space-y-2">
                        <div className="w-16 h-16 rounded-3xl bg-emerald-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 mb-4">
                            <Calculator className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-black dark:text-white uppercase">Portion Math</h2>
                        <p className="text-slate-500 font-medium">Calculate exact amounts to avoid "hidden waste" from overcooking.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-slate-500 ml-1">What are you cooking?</label>
                            <input 
                                className="w-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-4 font-bold outline-none focus:border-emerald-500 transition-all dark:text-white"
                                placeholder="e.g. Pasta Carbonara, Chicken Curry..."
                                value={dish}
                                onChange={(e) => setDish(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-slate-500 ml-1">For how many people?</label>
                            <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-2 rounded-2xl border-2 border-slate-100 dark:border-slate-800">
                                <button onClick={() => setPeople(Math.max(1, people - 1))} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-black">-</button>
                                <div className="flex-1 flex items-center justify-center gap-2 font-black dark:text-white">
                                    <Users className="w-4 h-4 text-emerald-500" />
                                    {people} {people === 1 ? 'Person' : 'People'}
                                </div>
                                <button onClick={() => setPeople(people + 1)} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-black">+</button>
                            </div>
                        </div>
                        <Button size="lg" className="w-full py-6 text-lg" onClick={handlePlan} isLoading={loading}>
                            Calculate Portions
                        </Button>
                        {aiError === "API_KEY_REQUIRED" && (
                            <p className="text-xs text-red-500 font-bold text-center mt-2">
                                API Key missing. Please set NEXT_PUBLIC_GEMINI_API_KEY in .env.local
                            </p>
                        )}
                    </div>

                    {result && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-6">
                            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-start gap-3">
                                <Zap className="w-5 h-5 text-emerald-600 mt-1 shrink-0" />
                                <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300 italic">"{result.tip}"</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {result.ingredients.map((ing: any, i: number) => (
                                    <div key={i} className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 flex justify-between items-center group hover:border-emerald-500 transition-all">
                                        <span className="font-bold dark:text-white">{ing.name}</span>
                                        <Badge variant="success">{ing.amount}</Badge>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </Card>
        </motion.div>
    );
}

function RemixLab({ items }: { items: any[] }) {
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [aiError, setAiError] = useState<string | null>(null);

    const toggleItem = (id: number) => {
        setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleRemix = async () => {
        if (selectedItems.length === 0) return;
        setLoading(true);
        setAiError(null);
        const selectedNames = items.filter(i => selectedItems.includes(i.id)).map(i => i.name).join(", ");
        const prompt = `Leftovers: ${selectedNames}. Give me a creative recipe using ALL of them. Return ONLY a JSON object with: title, difficulty, time, steps (array of strings), chefNote (string).`;
        try {
            const resp = await askAI(prompt);
            setResult(extractJSON(resp));
        } catch (e: any) {
            console.error(e);
            if (e.message.includes("API_KEY_REQUIRED")) setAiError("API_KEY_REQUIRED");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Select items to remix</h2>
                    <span className="text-xs font-bold text-emerald-600">{selectedItems.length} selected</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {items.map(item => (
                        <button 
                            key={item.id}
                            onClick={() => toggleItem(item.id)}
                            className={cn(
                                "p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 text-center",
                                selectedItems.includes(item.id) 
                                    ? "bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-950/30" 
                                    : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500 hover:border-slate-300"
                            )}
                        >
                            <span className="text-xl">🥪</span>
                            <span className="text-xs font-bold truncate w-full">{item.name}</span>
                        </button>
                    ))}
                </div>
                <Button 
                    size="lg" 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20 py-6"
                    disabled={selectedItems.length === 0}
                    onClick={handleRemix}
                    isLoading={loading}
                >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Launch Remix Engine
                </Button>
                {aiError === "API_KEY_REQUIRED" && (
                    <p className="text-xs text-red-500 font-bold text-center mt-2">
                        API Key missing. Please set NEXT_PUBLIC_GEMINI_API_KEY in .env.local
                    </p>
                )}
            </div>

            {result && (
                <Card className="overflow-hidden border-indigo-500/20 shadow-2xl shadow-indigo-500/10">
                    <div className="bg-indigo-600 p-6 text-white text-center space-y-2">
                        <ChefHat className="w-10 h-10 mx-auto opacity-50 mb-2" />
                        <h2 className="text-2xl font-black uppercase italic tracking-tighter">{result.title}</h2>
                        <div className="flex items-center justify-center gap-4 pt-2">
                            <span className="flex items-center gap-1 text-xs font-bold"><Timer className="w-3 h-3" /> {result.time}</span>
                            <span className="flex items-center gap-1 text-xs font-bold"><Flame className="w-3 h-3" /> {result.difficulty}</span>
                        </div>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="space-y-4">
                            {result.steps.map((step: string, i: number) => (
                                <div key={i} className="flex gap-4 group">
                                    <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center shrink-0 text-indigo-600 text-xs font-black group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                        {i + 1}
                                    </div>
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed pt-0.5">{step}</p>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 flex items-start gap-3">
                            <Info className="w-5 h-5 text-slate-400 mt-1" />
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400"><em>Chef's Note: {result.chefNote}</em></p>
                        </div>
                        <Button className="w-full rounded-xl bg-slate-900 text-white" onClick={() => window.print()}>
                            Print Instructions
                        </Button>
                    </div>
                </Card>
            )}
        </motion.div>
    );
}
