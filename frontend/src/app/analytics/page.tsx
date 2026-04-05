"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { api } from "@/lib/api";
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { BarChart3, TrendingUp, PieChart as PieIcon, DollarSign, Leaf, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function AnalyticsPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const impact = await api.analytics.getImpact();
      // Generate some mock history data if not available from backend
      const history = [
        { name: "Mon", waste: 0.5, saved: 1.2 },
        { name: "Tue", waste: 0.8, saved: 1.5 },
        { name: "Wed", waste: 0.2, saved: 2.1 },
        { name: "Thu", waste: 1.2, saved: 0.8 },
        { name: "Fri", waste: 0.4, saved: 1.9 },
        { name: "Sat", waste: 0.1, saved: 2.5 },
        { name: "Sun", waste: 0.3, saved: 2.2 },
      ];
      const categories = [
        { name: "Dairy", value: 35 },
        { name: "Produce", value: 45 },
        { name: "Bakery", value: 15 },
        { name: "Others", value: 5 },
      ];
      setData({ impact, history, categories });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <AnalyticsSkeleton />;

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
        <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Impact Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Data-driven evidence of your kitchen sustainability.</p>
      </div>

      {/* High Level Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Savings" value={`₹${data.impact.total_savings_calculated}`} icon={DollarSign} color="emerald" />
          <StatCard label="Eco Score" value="84" icon={Leaf} color="blue" />
          <StatCard label="Waste Rate" value="-12%" icon={TrendingUp} color="amber" sub="vs last week" />
          <StatCard label="Efficiency" value="92%" icon={PieIcon} color="indigo" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Waste vs Savings Trend */}
          <Card className="p-6">
              <div className="flex items-center justify-between mb-8">
                  <h3 className="font-bold text-slate-900 dark:text-white">Waste vs. Recovery Trend</h3>
                  <Badge variant="neutral">Weekly View</Badge>
              </div>
              <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data.history}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          />
                          <Legend />
                          <Line type="monotone" dataKey="waste" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                          <Line type="monotone" dataKey="saved" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      </LineChart>
                  </ResponsiveContainer>
              </div>
          </Card>

          {/* Financial Impact */}
          <Card className="p-6">
              <div className="flex items-center justify-between mb-8">
                  <h3 className="font-bold text-slate-900 dark:text-white">Financial Impact Distribution</h3>
                  <Badge variant="neutral">Category Based</Badge>
              </div>
              <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.history}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip 
                             cursor={{ fill: '#f1f5f9' }}
                             contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          />
                          <Bar dataKey="saved" fill="#10b981" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="waste" fill="#ef4444" radius={[4, 4, 0, 0]} />
                      </BarChart>
                  </ResponsiveContainer>
              </div>
          </Card>

          {/* Category Pie */}
          <Card className="p-6">
              <div className="flex items-center justify-between mb-8">
                  <h3 className="font-bold text-slate-900 dark:text-white">Waste Source Breakdown</h3>
              </div>
              <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                          <Pie
                            data={data.categories}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={8}
                            dataKey="value"
                          >
                            {data.categories.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                      </PieChart>
                  </ResponsiveContainer>
              </div>
          </Card>

          {/* Environmental Impact Summary */}
          <Card className="p-8 bg-emerald-600 text-white relative overflow-hidden">
              <div className="relative z-10 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                    <Leaf className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black">Environmental Champion</h3>
                  <p className="text-emerald-50 opacity-90 leading-relaxed">
                      You've prevented <strong>{data.impact.co2_saved_kg}kg</strong> of CO2 emissions this month. 
                      That's equivalent to planting <strong>3 young trees</strong>.
                  </p>
                  <div className="pt-4">
                      <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full bg-white w-3/4 rounded-full" />
                      </div>
                      <p className="mt-2 text-xs font-bold uppercase tracking-wider text-emerald-100">75% to Next Milestone</p>
                  </div>
              </div>
              <Leaf className="absolute -right-8 -bottom-8 w-48 h-48 opacity-10 rotate-12" />
          </Card>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, sub }: any) {
    return (
        <Card className="p-5">
            <div className="flex items-center gap-4">
                <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    color === "emerald" && "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10",
                    color === "blue" && "bg-blue-50 text-blue-600 dark:bg-blue-500/10",
                    color === "amber" && "bg-amber-50 text-amber-600 dark:bg-amber-500/10",
                    color === "indigo" && "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10",
                )}>
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">{label}</p>
                    <h4 className="text-xl font-black text-slate-900 dark:text-white leading-none">{value}</h4>
                    {sub && <p className="text-[10px] font-bold text-slate-400 mt-1">{sub}</p>}
                </div>
            </div>
        </Card>
    );
}

function AnalyticsSkeleton() {
    return (
        <div className="space-y-8">
            <Skeleton className="h-10 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[1,2,3,4].map(i => <Skeleton key={i} className="h-24" />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Skeleton className="h-96" />
                <Skeleton className="h-96" />
            </div>
        </div>
    );
}
