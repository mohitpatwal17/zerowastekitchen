"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { api } from "@/lib/api";
import { Trash2, Calendar, Filter, DollarSign, History, ChevronDown, Download, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function WasteLogPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await api.waste.getLogs();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalLoss = logs.reduce((acc, log) => acc + (log.cost_lost || 0), 0);
  const totalWeight = logs.reduce((acc, log) => acc + (log.quantity_wasted || 0), 0).toFixed(1);

  if (loading) return <WasteSkeleton />;

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
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Waste Archive</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Historical audit of kitchen disposals.</p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
            </Button>
            <Button size="sm">
                Log New Entry
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6 bg-red-500 text-white border-0 shadow-lg shadow-red-500/20">
              <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                      <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                      <p className="text-xs font-black uppercase tracking-widest text-red-100">Total Financial Loss</p>
                      <h3 className="text-3xl font-black">₹{totalLoss.toFixed(2)}</h3>
                  </div>
              </div>
          </Card>
          <Card className="p-6 bg-slate-900 text-white border-0 shadow-lg shadow-slate-900/20">
              <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                      <Trash2 className="w-6 h-6" />
                  </div>
                  <div>
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400">Total Mass Wasted</p>
                      <h3 className="text-3xl font-black">{totalWeight} kg</h3>
                  </div>
              </div>
          </Card>
      </div>

      <Card className="overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-black uppercase tracking-widest text-slate-500">History</span>
              </div>
              <Button variant="ghost" size="sm" className="text-xs">
                  <Filter className="w-3 h-3 mr-2" />
                  Filter by Reason
                  <ChevronDown className="ml-2 w-3 h-3" />
              </Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <th className="p-6">Ingredient</th>
                  <th className="p-6">Disposition Date</th>
                  <th className="p-6">Reason</th>
                  <th className="p-6 text-right">Qty</th>
                  <th className="p-6 text-right text-red-500">Loss</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {logs.length > 0 ? logs.map((log) => (
                  <tr key={log.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-6">
                      <span className="font-bold text-slate-900 dark:text-white capitalize">{log.item_name}</span>
                    </td>
                    <td className="p-6 text-sm text-slate-500 dark:text-slate-400">
                      {new Date(log.log_date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-6">
                        <Badge variant={log.reason === "Expired" ? "danger" : "warning"}>
                            {log.reason}
                        </Badge>
                    </td>
                    <td className="p-6 text-right text-sm font-bold text-slate-700 dark:text-slate-300">
                        {log.quantity_wasted} kg
                    </td>
                    <td className="p-6 text-right font-black text-red-500">
                        -₹{log.cost_lost?.toFixed(2)}
                    </td>
                  </tr>
                )) : (
                    <tr>
                        <td colSpan={5} className="p-20 text-center text-slate-400 font-bold italic">
                            No waste history found. Keep up the zero-waste streak!
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
      </Card>
    </div>
  );
}

function WasteSkeleton() {
    return (
        <div className="space-y-8">
            <Skeleton className="h-10 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
            </div>
            <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
    );
}
