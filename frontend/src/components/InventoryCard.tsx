"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Trash2, Edit3, Calendar, Droplets, Leaf } from "lucide-react";
import { getFoodEmoji } from "@/lib/food-utils";

interface InventoryItem {
  id: number;
  name: string;
  quantity: string;
  category: string;
  expiry_date: string;
  risk_status: string;
  risk_score: number;
  price: number;
}

export function InventoryCard({ 
  item, 
  onDelete, 
  onEdit,
  onWaste
}: { 
  item: InventoryItem; 
  onDelete: (id: number) => void;
  onEdit: (item: InventoryItem) => void;
  onWaste: (item: InventoryItem) => void;
}) {
  const isCritical = item.risk_status === "Critical" || item.risk_score > 80;
  const isHigh = item.risk_status === "High" || item.risk_score > 60;

  return (
    <Card className="group overflow-hidden">
      <div className="p-4 space-y-4">
        {/* Header: Emoji & Name */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl shadow-inner font-black text-slate-400">
              {getFoodEmoji(item.category, item.name)}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">{item.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{item.category} • {item.quantity}</p>
            </div>
          </div>
          <Badge 
            variant={isCritical ? "danger" : isHigh ? "warning" : "success"}
            pulse={isCritical}
          >
            {item.risk_status}
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                    <Calendar className="w-3 h-3 text-emerald-500" />
                    Expires
                </div>
                <p className="text-xs font-black text-slate-900 dark:text-slate-200">
                    {new Date(item.expiry_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                    <Leaf className="w-3 h-3 text-emerald-500" />
                    CO2 Save
                </div>
                <p className="text-xs font-black text-slate-900 dark:text-slate-200">0.8kg</p>
            </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="flex-1 rounded-xl"
            onClick={() => onEdit(item)}
          >
            <Edit3 className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="flex-1 rounded-xl hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
            onClick={() => onWaste(item)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button 
            size="sm" 
            className="flex-[2] rounded-xl"
            onClick={() => {/* Use Item Logic */}}
          >
            I've Used It
          </Button>
        </div>
      </div>
    </Card>
  );
}
