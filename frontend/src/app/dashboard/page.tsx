"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { 
  AlertTriangle, ArrowRight, DollarSign, Leaf, 
  Package, Zap, Sparkles, ChefHat, Clock, 
  UtensilsCrossed, Calendar, ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { askAI, extractJSON } from "@/lib/ai";
import { getFoodEmoji } from "@/lib/food-utils";
import { cn } from "@/lib/utils";

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
      
      // Trigger AI features once data is loaded
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
    const prompt = `Ingredients: ${expiring || "any staples"}. Suggest 3 Indian meals to avoid waste. Return ONLY a JSON array of objects with: title, time, isVeg, ingredientsUsed.`;
    
    try {
      const resp = await askAI(prompt);
      setAiSuggestions(extractJSON(resp));
    } catch (e: any) {
      console.error("AI Suggestions failed:", e);
      if (e.message.includes("API_KEY_REQUIRED")) {
        setAiError("API_KEY_REQUIRED");
      } else {
        setAiError("GENERIC_ERROR");
      }
    } finally {
      setAiLoading(false);
    }
  };

  const checkZeroWasteProtocol = async (items: any[]) => {
    const critical = items.find(i => i.risk_status === "Critical");
    if (!critical) return;

    const prompt = `I have ${critical.name} expiring in a few hours. Give me 2 quick ways to use it or preserve it today. Keep it under 20 words.`;
    try {
      const resp = await askAI(prompt);
      setProtocolTip(resp);
    } catch (e) {
      console.error("Zero Waste Protocol failed:", e);
    }
  };


  if (loading) return <DashboardSkeleton />;
  
  if (!data || !data.items || !data.impact) {
      return (
          <div className="w-full flex flex-col items-center justify-center p-12 text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
              <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase mb-2">Connection Issues</h2>
              <p className="text-slate-500 font-medium max-w-sm">We couldn't connect to the AI brain or retrieve your kitchen data. Please try refreshing.</p>
              <Button className="mt-6" onClick={() => window.location.reload()}>Reload Dashboard</Button>
          </div>
      );
  }

  const criticalItems = data.items.filter((i: any) => i.risk_score > 70);


  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Kitchen Pulse</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium truncate sm:whitespace-normal">Real-time intelligence for your zero-waste journey.</p>
      </div>

      {/* Urgent Alert Banner */}
      {criticalItems.length > 0 && (
        <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="group relative overflow-hidden rounded-3xl bg-red-500 p-6 text-white shadow-2xl shadow-red-500/20"
        >
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center animate-pulse">
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black uppercase italic tracking-wider">Zero Waste Protocol Active</h2>
                        <p className="text-red-100 text-sm font-bold leading-tight">
                            {criticalItems.length} items need rescue today! 
                            {protocolTip && <span className="ml-2 block sm:inline opacity-80 italic">— {protocolTip}</span>}
                        </p>
                    </div>
                </div>
                <Button variant="secondary" size="lg" className="w-full md:w-auto bg-white text-red-600 hover:bg-red-50">
                    Rescue Now
                    <ArrowRight className="w-4 h-4" />
                </Button>
            </div>
            {/* Background Graphic */}
            <Zap className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 rotate-12" />
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "At Risk", value: criticalItems.length, icon: Package, color: "red", detail: "Items expiring < 48h" },
          { label: "Savings Opportunity", value: `₹${data.impact.potential_savings_opportunity}`, icon: DollarSign, color: "emerald", detail: "Potential loss prevented" },
          { label: "Planet Impact", value: `${data.impact.co2_saved_kg}kg`, icon: Leaf, color: "blue", detail: "CO2 Emissions prevented" },
        ].map((stat, i) => (
          <Card key={i} className="p-5 flex items-center justify-between group">
            <div className="flex items-center gap-4 overflow-hidden">
               <div className={cn(
                   "w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-12",
                   stat.color === "red" && "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400 shadow-red-500/10",
                   stat.color === "emerald" && "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 shadow-emerald-500/10",
                   stat.color === "blue" && "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 shadow-blue-500/10"
               )}>
                   <stat.icon className="w-6 h-6" />
               </div>
                <div className="min-w-0 flex-1">
                   <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{stat.label}</p>
                   <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-tight break-words">{stat.value}</h3>
                   <p className="text-[10px] font-bold text-slate-500 leading-tight">{stat.detail}</p>
                </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Smart Matches Section */}
        <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-xl font-bold dark:text-white">Smart Matches</h2>
                </div>
                <Button variant="ghost" size="sm" onClick={() => generateAiMeals(data.items)}>
                    Refresh AI
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {aiLoading ? (
                    [1,2].map(i => <Skeleton key={i} className="h-44 rounded-3xl" />)
                ) : aiError === "API_KEY_REQUIRED" ? (
                    <Card className="col-span-full p-8 flex flex-col items-center justify-center text-center border-emerald-500/20 bg-emerald-500/5">
                        <Sparkles className="w-12 h-12 text-emerald-500 mb-4 animate-pulse" />
                        <h3 className="text-lg font-black dark:text-white uppercase tracking-tight">AI Activation Required</h3>
                        <p className="text-slate-500 font-medium max-w-xs mb-6 px-4">Set your <strong>NEXT_PUBLIC_OPENAI_API_KEY</strong> in <code>.env.local</code> to unlock smart recipes.</p>
                        <Button size="sm" onClick={() => window.open('https://aistudio.google.com/app/apikey', '_blank')}>
                            Get API Key
                        </Button>
                    </Card>
                ) : aiError === "GENERIC_ERROR" ? (
                    <Card className="col-span-full p-8 flex flex-col items-center justify-center text-center border-red-500/20 bg-red-500/5">
                        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
                        <h3 className="text-lg font-black dark:text-white uppercase tracking-tight">AI Pulse Weak</h3>
                        <p className="text-slate-500 font-medium max-w-xs mb-4">We're having trouble reaching the AI. Try refreshing your API key or checking your internet connection.</p>
                        <Button size="sm" variant="outline" onClick={() => generateAiMeals(data.items)}>
                            Retry AI
                        </Button>
                    </Card>
                ) : aiSuggestions.length > 0 ? (
                    aiSuggestions.map((meal, i) => (
                        <Card key={i} className="p-5 border-indigo-50 dark:border-indigo-900/30">
                            <div className="flex justify-between items-start mb-4">
                                <Badge variant="info">{meal.time} mins</Badge>
                                <Badge variant={meal.isVeg ? "success" : "neutral"}>{meal.isVeg ? "Veg" : "Non-Veg"}</Badge>
                            </div>
                            <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2 leading-tight">{meal.title}</h4>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {meal.ingredientsUsed.map((ing: string, j: number) => (
                                    <span key={j} className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-bold text-slate-500">
                                        {ing}
                                    </span>
                                ))}
                            </div>
                            <Button size="sm" className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20">
                                View Recipe
                            </Button>
                        </Card>
                    ))
                ) : (
                    <Card className="col-span-full p-8 flex flex-col items-center justify-center text-center border-dashed border-2">
                        <UtensilsCrossed className="w-12 h-12 text-slate-300 mb-4" />
                        <p className="text-slate-500 font-bold">Add ingredients to unlock smart meal suggestions.</p>
                    </Card>
                ) }
            </div>
        </div>

        {/* Expiry Timeline Section */}
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <Calendar className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold dark:text-white">Timeline</h2>
            </div>
            
            <Card className="p-6">
                <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-3 before:w-px before:bg-slate-100 dark:before:bg-slate-800">
                    {data.items.slice(0, 5).map((item: any, i: number) => (
                        <div key={i} className="relative pl-10">
                            <div className={cn(
                                "absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-slate-900 transition-colors",
                                item.risk_score > 75 ? "bg-red-500" : item.risk_score > 40 ? "bg-amber-500" : "bg-emerald-500"
                            )}>
                                <span className="text-[10px] text-white font-black">{getFoodEmoji(item.category)}</span>
                            </div>
                            <div className="min-w-0 flex-1">
                                <h5 className="font-bold text-sm text-slate-900 dark:text-white leading-snug break-words">{item.name}</h5>
                                <p className="text-xs text-slate-500">Expires {new Date(item.expiry_date).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))}
                    <Button variant="ghost" className="w-full mt-4 text-emerald-600 text-xs font-bold uppercase tracking-wider">
                        View Full Inventory
                        <ArrowRight className="ml-2 w-3 h-3" />
                    </Button>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-5 w-64" />
            </div>
            <Skeleton className="h-32 w-full rounded-3xl" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
            </div>
        </div>
    );
}
