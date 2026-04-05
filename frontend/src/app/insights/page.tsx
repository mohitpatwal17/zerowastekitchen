"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { api } from "@/lib/api";
import { askAI, extractJSON } from "@/lib/ai";
import { Lightbulb, TrendingDown, Target, Zap, ChefHat, Info, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function InsightsPage() {
  const router = useRouter();
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    setLoading(true);
    setAiError(null);
    try {
      const data = await api.insights.getBehavioral();
      setInsights(data);
      
      // Enhance with real AI if list is small
      if (data.length < 3) generateAiInsights();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateAiInsights = async () => {
      setAiLoading(true);
      setAiError(null);
      const prompt = `Context: dairy and bread waste. Suggest 3 behavioral habits to reduce waste. Return ONLY a JSON array of objects with keys: title, category (Habit/Hack/Fact), description.`;
      try {
          const aiResponse = await askAI(prompt);
          const parsed = extractJSON<any[]>(aiResponse);
          setInsights((prev: any[]) => [...prev, ...parsed]);
      } catch (e: any) {
          console.error(e);
          if (e.message.includes("API_KEY_REQUIRED")) setAiError("API_KEY_REQUIRED");
      } finally {
          setAiLoading(false);
      }
  };

  if (loading) return <InsightsSkeleton />;

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </button>

      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Behavioral Insights</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium font-outfit">AI-driven patterns to optimize your consumption.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {insights.map((insight: any, i: number) => (
             <Card key={i} className="group relative overflow-hidden border-2 border-slate-100 dark:border-slate-800 hover:border-emerald-500/30">
                 <div className="p-6 space-y-4">
                     <div className="flex items-start justify-between">
                         <Badge variant={
                             insight.category === "Habit" ? "info" : 
                             insight.category === "Hack" ? "warning" : "neutral"
                         }>
                             {insight.category || "Behavior"}
                         </Badge>
                         <Lightbulb className="w-5 h-5 text-amber-500" />
                     </div>
                     
                     <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                         {insight.title || insight.pattern || "Waste Pattern"}
                     </h3>
                     
                     <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed">
                         {insight.description || insight.recommendation || insight.impact}
                     </p>

                     <div className="pt-4 flex items-center justify-between">
                         <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                             <TrendingDown className="w-3 h-3 text-red-500" />
                             Estimated Waste: ₹45/mo
                         </div>
                         <Button variant="ghost" size="sm" className="h-8 text-[10px] uppercase font-black tracking-widest">
                             Fix it
                         </Button>
                     </div>
                 </div>
                 {/* Decorative background icon */}
                 <Target className="absolute -right-4 -bottom-4 w-24 h-24 text-slate-50 dark:text-slate-900/50 -rotate-12 group-hover:scale-110 transition-transform" />
             </Card>
          ))}

          {aiLoading && [1,2].map(i => <Skeleton key={i} className="h-56 rounded-3xl" />)}
          
          {aiError === "API_KEY_REQUIRED" && (
              <Card className="col-span-full p-8 border-amber-500/20 bg-amber-500/5 flex flex-col items-center text-center">
                  <Info className="w-10 h-10 text-amber-500 mb-4" />
                  <h3 className="text-lg font-black dark:text-white uppercase">AI Insights Locked</h3>
                  <p className="text-slate-500 font-medium mb-4">Set <strong>NEXT_PUBLIC_OPENAI_API_KEY</strong> in <code>.env.local</code> to generate behavioral optimizations.</p>
                  <Button size="sm" variant="outline" onClick={() => window.open('https://aistudio.google.com/app/apikey', '_blank')}>
                      Get Free API Key
                  </Button>
              </Card>
          )}
      </div>

      {/* Proactive Section */}
      <Card className="p-8 bg-slate-900 text-white border-0 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="w-20 h-20 rounded-3xl bg-emerald-500 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/30">
                  <ChefHat className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-2">
                  <h3 className="text-2xl font-black italic">The "First In, First Out" Discipline</h3>
                  <p className="text-slate-400 font-bold max-w-lg">
                      Users who follow FIFO waste 40% less on average. Rotate your fridge weekly to keep older items at the front.
                  </p>
                  <div className="pt-4">
                      <Button variant="secondary" className="bg-white text-slate-900 hover:bg-slate-100">
                          Set Reminder
                      </Button>
                  </div>
              </div>
          </div>
          <Zap className="absolute -right-4 -bottom-4 w-40 h-40 opacity-5 rotate-12" />
      </Card>
    </div>
  );
}

function InsightsSkeleton() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <Skeleton className="h-10 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-56 rounded-3xl" />
                <Skeleton className="h-56 rounded-3xl" />
                <Skeleton className="h-56 rounded-3xl" />
                <Skeleton className="h-56 rounded-3xl" />
            </div>
        </div>
    );
}
