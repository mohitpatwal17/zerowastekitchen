"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowLeft, Plus, Calendar, Tag, DollarSign, Package } from "lucide-react";
import Link from "next/link";

export default function AddItemPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "Produce",
    quantity: "1 unit",
    expiry_date: new Date().toISOString().split("T")[0],
    price: 0.0,
    storage_type: "fridge"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        router.push("/inventory");
      }
    } catch (err) {
      console.error("Failed to add item:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Link href="/inventory" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Inventory
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Add New Item</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Add details about your product for AI risk tracking.</p>
      </div>

      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Item Name</label>
            <Input 
              required
              placeholder="e.g. Organic Milk" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              icon={<Package className="w-5 h-5" />}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Category</label>
              <select 
                className="w-full h-11 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 text-base focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="Produce">Produce</option>
                <option value="Dairy">Dairy</option>
                <option value="Pantry">Pantry</option>
                <option value="Meat/Protein">Meat/Protein</option>
                <option value="Bakery">Bakery</option>
                <option value="Frozen">Frozen</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Expiry Date</label>
              <Input 
                required
                type="date"
                value={formData.expiry_date}
                onChange={(e) => setFormData({...formData, expiry_date: e.target.value})}
                icon={<Calendar className="w-5 h-5" />}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Price (USD)</label>
              <Input 
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                icon={<DollarSign className="w-5 h-5" />}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Storage Location</label>
              <select 
                className="w-full h-11 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 text-base focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                value={formData.storage_type}
                onChange={(e) => setFormData({...formData, storage_type: e.target.value})}
              >
                <option value="fridge">Fridge</option>
                <option value="pantry">Pantry</option>
                <option value="freezer">Freezer</option>
                <option value="counter">Counter</option>
              </select>
            </div>
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full" isLoading={loading}>
              <Plus className="w-5 h-5 mr-2" />
              Add to Inventory
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
