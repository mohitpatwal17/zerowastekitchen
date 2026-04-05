"use client";

import React, { useState, useEffect } from "react";
import { InventoryCard } from "@/components/InventoryCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { api } from "@/lib/api";
import { Search, Plus, Filter, PackageOpen, LayoutGrid, List, ChevronLeft } from "lucide-react";
import { LoadingState } from "@/components/ui/States";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function InventoryPage() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await api.items.getAll();
      setItems(data);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Remove this item?")) {
      await api.items.delete(id);
      fetchItems();
    }
  };

  const handleWaste = async (item: any) => {
      await api.waste.log({
          item_name: item.name,
          reason: "Expired",
          quantity_wasted: 1.0,
          cost_lost: item.price || 0
      });
      fetchItems();
  };

  const filteredItems = items.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase())
  );


  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Inventory</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium font-outfit">Manage your kitchen assets and rescue items.</p>
        </div>
        <Button size="lg" onClick={() => { setEditingItem(null); setIsModalOpen(true); }} className="hidden sm:flex shadow-emerald-500/20">
          <Plus className="w-5 h-5 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Mobile-only Add Item */}
      <div className="flex sm:hidden">
           <Button className="w-full h-14 rounded-2xl text-lg font-black uppercase" onClick={() => setIsModalOpen(true)}>
              <Plus className="w-6 h-6 mr-2" />
              New Item
           </Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all focus-within:border-emerald-500/50 focus-within:ring-4 focus-within:ring-emerald-500/5">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search ingredients..." 
            className="w-full bg-transparent border-0 ring-0 focus:ring-0 pl-12 pr-4 py-2 text-sm font-bold placeholder:text-slate-400 dark:text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="hidden md:flex items-center gap-2 pr-2">
            <Button variant="ghost" size="icon" className="text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30"><LayoutGrid className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon"><List className="w-4 h-4" /></Button>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Scanning items..." />
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredItems.map(item => (
            <InventoryCard 
              key={item.id} 
              item={item} 
              onDelete={handleDelete}
              onEdit={(item) => { setEditingItem(item); setIsModalOpen(true); }}
              onWaste={handleWaste}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <PackageOpen className="w-20 h-20 text-slate-200 dark:text-slate-800 mb-6" />
            <h3 className="text-xl font-bold dark:text-white mb-2 uppercase">Empty Larder</h3>
            <p className="text-slate-500 max-w-xs mb-8">You haven't added any items yet. Start by stocking your virtual kitchen!</p>
            <Button size="lg" onClick={() => setIsModalOpen(true)}>Add your first item</Button>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingItem ? "Edit Item" : "New Item"}
      >
        <InventoryForm 
            item={editingItem} 
            onSuccess={() => { setIsModalOpen(false); fetchItems(); }} 
            onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

function InventoryForm({ item, onSuccess, onCancel }: any) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: item?.name || "",
        category: item?.category || "Produce",
        quantity: item?.quantity || "1 kg",
        price: item?.price || 0,
        storage_type: item?.storage_type || "fridge"
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (item) {
                await api.items.update(item.id, formData);
            } else {
                await api.items.create(formData);
            }
            onSuccess();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-500 ml-1">Item Name</label>
                <input 
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl p-4 font-bold text-slate-900 dark:text-white ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-emerald-500 transition-all"
                    placeholder="e.g. Milk, Onions..."
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-500 ml-1">Category</label>
                    <select 
                        className="w-full bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl p-4 font-bold text-slate-900 dark:text-white ring-1 ring-slate-200 dark:ring-slate-700"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                        <option>Produce</option>
                        <option>Dairy</option>
                        <option>Meat</option>
                        <option>Bakery</option>
                        <option>Pantry</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-500 ml-1">Quantity</label>
                    <input 
                        className="w-full bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl p-4 font-bold text-slate-900 dark:text-white ring-1 ring-slate-200 dark:ring-slate-700"
                        placeholder="1 kg, 500ml..."
                        value={formData.quantity}
                        onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-500 ml-1">Price (₹)</label>
                <input 
                    type="number"
                    className="w-full bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl p-4 font-bold text-slate-900 dark:text-white ring-1 ring-slate-200 dark:ring-slate-700"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                />
            </div>
            <div className="flex gap-3 pt-4">
                <Button type="button" variant="ghost" className="flex-1" onClick={onCancel}>Cancel</Button>
                <Button type="submit" className="flex-1" isLoading={loading}>
                    {item ? "Save Changes" : "Confirm Stock"}
                </Button>
            </div>
        </form>
    );
}
