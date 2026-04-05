"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { 
  AlertTriangle, ArrowRight, DollarSign, Leaf, 
  Package, Zap, Sparkles, Clock, 
  UtensilsCrossed, Calendar, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { askAI, extractJSON } from "@/lib/ai";
import { getFoodEmoji } from "@/lib/food-utils";
import { cn } from "@/lib/utils";

// Premium Glass Card Component
function GlassCard({ children, className, glowColor = "transparent" }: { children: React.ReactNode, className?: string, glowColor?: string }) {
  return (
    <div className={cn(
      "group relative overflow-hidden rounded-[2rem] bg-white/80 dark:bg-[#151515]/90 backdrop-blur-2xl border border-white/40 dark:border-white/5",
      "shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-all duration-500",
      className
    )}>
      {/* Subtle Glow */}
      <div 
        className="absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem]"
        style={{ background: `radial-gradient(circle at 50% 0%, ${glowColor}, transparent 70%)` }}
      />
      <div className="relative z-10 w-full h-full flex flex-col">
        {children}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [protocolTip, setProtocolTip] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [items, impact] = await Promise.all([
        api.items.getAll(),
        api.analytics.getImpact(),
      ]);
      setData({ items, impact });
      
      if (items.length > 0) {
        generateAiMeals(items);
        checkZeroWasteProtocol(items);
      }
    } catch (err) {
      console.error("Dashboard load failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const generateAiMeals = async (items: any[]) => {
    setAiLoading(true);
    setAiError(null);
    const expiring = items.filter(i => i.risk_score > 50).map(i => i.name).join(", ");
    const prompt = `Ingredients: ${expiring || "any staples"}. Suggest 3 meals to avoid waste. Return ONLY a JSON array of objects with: title, time, isVeg, ingredientsUsed.`;
    
    try {
      const resp = await askAI(prompt);
      const output = extractJSON<any[]>(resp);
      if (!output || !Array.isArray(output) || output.length === 0) setAiSuggestions([]);
      else setAiSuggestions(output);
    } catch (e: any) {
      console.error("AI failed:", e);
      setAiError(e.message.includes("API_KEY_REQUIRED") ? "API_KEY_REQUIRED" : "GENERIC_ERROR");
    } finally {
      setAiLoading(false);
    }
  };

  const checkZeroWasteProtocol = async (items: any[]) => {
    const critical = items.find(i => i.risk_status === "Critical");
    if (!critical) return;
    const prompt = `I have ${critical.name} expiring today. Give 1 creative way to preserve it inside 10 words.`;
    try {
      const resp = await askAI(prompt);
      setProtocolTip(resp);
    } catch (e) {}
  };


  if (loading) return <DashboardSkeleton />;
  
  if (!data || !data.items || !data.impact) {
      return (
          <div className="w-full flex flex-col items-center justify-center h-[70vh] text-center">
              <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">Neural Disconnect</h2>
              <p className="text-slate-500 font-medium max-w-sm text-lg">Unable to establish connection with the AI core network.</p>
              <Button className="mt-8 rounded-full px-8 py-6 text-lg" onClick={() => window.location.reload()}>Reinitialize</Button>
          </div>
      );
  }

  const criticalItems = data.items.filter((i: any) => i.risk_score > 70);

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6 animate-in slide-in-from-bottom-8 fade-in duration-1000 pb-20 relative">
      
      {/* Ambient Premium Mesh Background */}
      <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
         <div className="absolute top-[-10%] -left-[-10%] w-[500px] h-[500px] bg-emerald-500/20 dark:bg-emerald-500/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-70 animate-pulse" style={{ animationDuration: "12s" }} />
         <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-rose-500/20 dark:bg-rose-500/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-70 animate-pulse" style={{ animationDuration: "15s" }} />
         <div className="absolute bottom-[-10%] left-[20%] w-[800px] h-[800px] bg-indigo-500/20 dark:bg-indigo-500/10 rounded-full blur-[150px] mix-blend-multiply dark:mix-blend-screen opacity-70 animate-pulse" style={{ animationDuration: "18s" }} />
      </div>

      {/* Header section with sleek minimalist typography */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 px-2 pt-4">
        <div className="flex flex-col gap-1 relative z-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-500 tracking-tighter">
              Overview
            </h1>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Your automated zero-waste command center.</p>
          </motion.div>
        </div>
      </div>

      {/* Hero Protocol Alert */}
      <AnimatePresence>
        {criticalItems.length > 0 && (
          <motion.div 
              initial={{ scale: 0.95, opacity: 0, height: 0 }}
              animate={{ scale: 1, opacity: 1, height: "auto" }}
              className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-rose-500 to-orange-500 p-8 md:p-10 text-white shadow-[0_20px_40px_rgba(244,63,94,0.3)] dark:shadow-[0_20px_40px_rgba(244,63,94,0.1)]"
          >
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex items-center gap-6 w-full md:w-auto">
                      <div className="w-16 h-16 shrink-0 rounded-[1.2rem] bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center animate-pulse shadow-inner">
                          <AlertTriangle className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-rose-100 mb-1">CRITICAL PROTOCOL</h2>
                          <p className="text-2xl md:text-3xl font-black leading-tight tracking-tight">
                              Rescue {criticalItems.length} items immediately.
                          </p>
                          {protocolTip && (
                             <p className="mt-2 text-rose-100 font-medium text-lg leading-snug">
                                <Sparkles className="inline-block w-4 h-4 mr-1.5 -translate-y-0.5 text-orange-200" />
                                AI Suggests: {protocolTip}
                             </p>
                          )}
                      </div>
                  </div>
                  <Button size="lg" className="w-full md:w-auto bg-white/20 hover:bg-white/30 text-white border border-white/40 shadow-xl backdrop-blur-md rounded-2xl py-7 text-lg group">
                      Take Action
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
              </div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full mix-blend-overlay pointer-events-none translate-x-1/2 -translate-y-1/2" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* BENTO BOX GRID */}
      <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 auto-rows-[minmax(180px,auto)]">
        
        {/* STAT 1 - High Risk */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <GlassCard glowColor="rgba(244,63,94,0.1)" className="h-full p-8 flex flex-col justify-between group cursor-pointer hover:-translate-y-1">
            <div className="flex items-center justify-between w-full mb-6">
               <div className="w-12 h-12 rounded-[1rem] bg-rose-500/10 text-rose-500 flex items-center justify-center">
                   <Package className="w-6 h-6" />
               </div>
            </div>
            <div>
               <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Expiring Soon</p>
               <h3 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">{criticalItems.length}</h3>
               <p className="text-sm font-bold text-rose-500 mt-2">Needs attention &lt; 48h</p>
            </div>
          </GlassCard>
        </div>

        {/* STAT 2 - Impact */}
        <div className="col-span-1 md:col-span-2 lg:col-span-4">
          <GlassCard glowColor="rgba(16,185,129,0.1)" className="h-full p-8 flex flex-col justify-between group cursor-pointer hover:-translate-y-1">
            <div className="flex items-center justify-between w-full mb-6">
               <div className="w-12 h-12 rounded-[1rem] bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                   <DollarSign className="w-6 h-6" />
               </div>
               <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-black uppercase tracking-widest">
                  Financial
               </div>
            </div>
            <div>
               <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Loss Saved</p>
               <h3 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter flex items-end gap-1">
                 ₹{data.impact.potential_savings_opportunity}
               </h3>
               <p className="text-sm font-bold text-emerald-500 mt-2">Potential waste averted</p>
            </div>
          </GlassCard>
        </div>

        {/* STAT 3 - Earth */}
        <div className="col-span-1 md:col-span-2 lg:col-span-5">
          <GlassCard glowColor="rgba(59,130,246,0.1)" className="h-full p-8 bg-slate-900 dark:bg-[#0f1014] text-white overflow-hidden group cursor-pointer hover:-translate-y-1 border-none">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/0 opacity-50" />
            <div className="absolute -right-10 -bottom-10 opacity-20 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700">
               <Leaf className="w-64 h-64 text-blue-400" />
            </div>
            <div className="relative z-10 flex flex-col justify-between h-full">
               <div className="w-12 h-12 rounded-[1rem] bg-blue-500/20 text-blue-400 flex items-center justify-center mb-6">
                   <Leaf className="w-6 h-6" />
               </div>
               <div>
                 <p className="text-xs font-black uppercase tracking-widest text-blue-200/50 mb-2">Ecological Impact</p>
                 <h3 className="text-6xl font-black tracking-tighter flex items-baseline gap-2">
                   {data.impact.co2_saved_kg}<span className="text-2xl text-blue-400">kg</span>
                 </h3>
                 <p className="text-sm font-bold text-blue-300 mt-2 tracking-wide">CO₂ emissions prevented from landfills</p>
               </div>
            </div>
          </GlassCard>
        </div>

        {/* SMART MATCHES MODULE */}
        <div className="col-span-1 md:col-span-6 lg:col-span-8 flex flex-col h-full min-h-[500px]">
          <GlassCard glowColor="rgba(99,102,241,0.05)" className="h-full p-8 flex flex-col">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-[1.2rem] bg-indigo-500/10 flex items-center justify-center text-indigo-500 shadow-inner">
                       <Zap className="w-6 h-6" />
                   </div>
                   <div>
                      <h2 className="text-2xl font-black dark:text-white tracking-tighter">AI Synthesis</h2>
                      <p className="text-slate-500 text-sm font-bold">Auto-generated recipes from your inventory</p>
                   </div>
               </div>
               <Button variant="ghost" className="rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700" onClick={() => generateAiMeals(data.items)}>
                   <Sparkles className="w-4 h-4 mr-2 text-indigo-500" />
                   Resynthesize
               </Button>
            </div>

            <div className="flex-1 flex flex-col justify-center">
                {aiLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-100 dark:bg-[#1a1a1a] rounded-3xl animate-pulse" />)}
                    </div>
                ) : aiError === "API_KEY_REQUIRED" ? (
                    <div className="p-10 flex flex-col items-center justify-center text-center bg-emerald-500/5 border border-emerald-500/20 rounded-3xl">
                        <Sparkles className="w-12 h-12 text-emerald-500 mb-4 animate-pulse" />
                        <h3 className="text-xl font-black dark:text-white uppercase tracking-tight mb-2">Neural Link Required</h3>
                        <p className="text-slate-500 font-medium max-w-sm mb-6">Initialize the AI core by setting your API key to unlock autonomous meal intelligence.</p>
                        <Button className="rounded-full px-8 py-5" onClick={() => window.open('https://aistudio.google.com/app/apikey', '_blank')}>
                            Configure Core
                        </Button>
                    </div>
                ) : aiSuggestions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {aiSuggestions.map((meal, i) => (
                          <div key={i} className="group/card relative overflow-hidden bg-slate-50 dark:bg-[#1a1a1a] rounded-[1.5rem] p-6 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 border border-transparent dark:border-white/5 hover:border-indigo-500/30 transition-colors duration-300">
                              <div className="flex justify-between items-start mb-4">
                                  <div className="flex items-center gap-2">
                                      <span className="flex items-center text-[10px] font-black uppercase text-indigo-600 bg-indigo-500/10 px-2 py-1 rounded-md tracking-wider">
                                          <Clock className="w-3 h-3 mr-1" /> {meal.time}
                                      </span>
                                      <span className={cn("text-[10px] font-black uppercase px-2 py-1 rounded-md tracking-wider", meal.isVeg ? "text-emerald-600 bg-emerald-500/10" : "text-orange-600 bg-orange-500/10")}>
                                          {meal.isVeg ? "Veg" : "Non-Veg"}
                                      </span>
                                  </div>
                              </div>
                              <h4 className="text-xl font-black text-slate-900 dark:text-white leading-tight mb-3 tracking-tight">{meal.title}</h4>
                              <div className="flex flex-wrap gap-1.5 mt-auto">
                                  {meal.ingredientsUsed.map((ing: string, j: number) => (
                                      <span key={j} className="text-[10px] px-2.5 py-1 bg-white dark:bg-black/40 rounded-full font-bold text-slate-500 border border-slate-200 dark:border-white/10 shadow-sm">
                                          {ing}
                                      </span>
                                  ))}
                              </div>
                              {/* Hover arrow graphic */}
                              <div className="absolute bottom-5 right-5 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white opacity-0 transform translate-x-4 group-hover/card:opacity-100 group-hover/card:translate-x-0 transition-all duration-300 shadow-lg shadow-indigo-500/30">
                                  <ArrowRight className="w-4 h-4" />
                              </div>
                          </div>
                      ))}
                    </div>
                ) : data.items.length > 0 ? (
                    <div className="p-10 flex flex-col items-center justify-center text-center bg-slate-50 dark:bg-[#1a1a1a] rounded-[2rem]">
                        <UtensilsCrossed className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-6" />
                        <h3 className="text-xl font-black dark:text-white tracking-tighter mb-2">Systems Ready</h3>
                        <p className="text-slate-500 font-medium max-w-sm mb-6">Inventory loaded. Awaiting command to synthesize zero-waste meal routes.</p>
                        <Button className="rounded-full px-8 py-5" onClick={() => generateAiMeals(data.items)}>Synthesize Now</Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center mb-6">
                            <Package className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                        </div>
                        <h3 className="text-xl font-black dark:text-white tracking-tighter mb-2">Vault Empty</h3>
                        <p className="text-slate-500 font-medium">Add ingredients to activate the AI core.</p>
                    </div>
                ) }
            </div>
          </GlassCard>
        </div>

        {/* TIMELINE MODULE */}
        <div className="col-span-1 md:col-span-6 lg:col-span-4 min-w-0">
          <GlassCard className="h-full p-8 bg-gradient-to-b from-slate-50 to-white dark:from-[#111] dark:to-[#0f0f0f]">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-[1.2rem] bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-inner">
                    <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black dark:text-white tracking-tighter">Event Horizon</h2>
                  <p className="text-slate-500 text-sm font-bold">Impending expirations</p>
                </div>
            </div>
            
            <div className="relative pl-5 space-y-6 before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-gradient-to-b before:from-rose-500 before:via-amber-500 before:to-emerald-500 rounded-lg">
                {data.items.slice(0, 5).map((item: any, i: number) => (
                    <div key={i} className="relative group">
                        <div className={cn(
                            "absolute -left-[1.35rem] top-1 w-3 h-3 rounded-full ring-4 ring-white dark:ring-[#111] z-10 transition-transform group-hover:scale-150 duration-300",
                            item.risk_score > 75 ? "bg-rose-500" : item.risk_score > 40 ? "bg-amber-500" : "bg-emerald-500"
                        )} />
                        <div className="bg-white dark:bg-[#1a1a1a] border border-slate-100 dark:border-white/5 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-1">
                                <h5 className="font-black text-slate-900 dark:text-white truncate pr-2">{item.name}</h5>
                                <span className="text-lg leading-none">{getFoodEmoji(item.category, item.name)}</span>
                            </div>
                            <p className="text-xs font-bold text-slate-500">
                                Expires {new Date(item.expiry_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            
            <Button variant="outline" className="w-full mt-8 rounded-full border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold tracking-widest text-xs uppercase h-12">
                Open Full Vault
            </Button>
          </GlassCard>
        </div>

      </div>
    </div>
  );
}

function DashboardSkeleton() {
    return (
        <div className="w-full max-w-[1400px] mx-auto space-y-8 animate-pulse text-center">
            <Skeleton className="h-16 w-64 rounded-2xl" />
            <Skeleton className="h-44 w-full rounded-[2rem]" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
                <Skeleton className="lg:col-span-3 h-48 rounded-[2rem]" />
                <Skeleton className="lg:col-span-4 h-48 rounded-[2rem]" />
                <Skeleton className="lg:col-span-5 h-48 rounded-[2rem]" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
                <Skeleton className="lg:col-span-8 h-96 rounded-[2rem]" />
                <Skeleton className="lg:col-span-4 h-96 rounded-[2rem]" />
            </div>
        </div>
    );
}
