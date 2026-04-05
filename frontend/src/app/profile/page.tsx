"use client";

import { User, Settings, LogOut, ChevronRight, ShoppingCart, ChefHat, Building2, Utensils } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useLocalization } from "@/lib/LocalizationContext";

export default function Profile() {
    const { t } = useLocalization();
    const [role, setRole] = useState("household");

    useEffect(() => {
        const stored = localStorage.getItem("userRole");
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (stored) setRole(stored);
    }, []);

    const toggleRole = () => {
        const newRole = role === "household" ? "restaurant" : "household";
        setRole(newRole);
        localStorage.setItem("userRole", newRole);
        window.dispatchEvent(new Event("storage")); // Notify other tabs/components
        // For MVP, reload to apply global theme changes easily
        window.location.href = "/";
    };

    return (
        <main className="min-h-screen bg-slate-50 pb-24">
            <div className={`pt-10 pb-24 px-6 rounded-b-[3rem] relative overflow-hidden transition-colors duration-500 ${role === 'restaurant' ? 'bg-slate-800' : 'bg-emerald-600'}`}>
                <div className="flex items-center gap-4 relative z-10 text-white">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/30">
                        {role === 'restaurant' ? <ChefHat size={32} /> : <User size={32} />}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Mohit Patwal</h1>
                        <p className="opacity-80 text-sm">
                            {role === 'restaurant' ? "Head Chef • Eco-Log" : "Eco-Warrior Level 5"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="-mt-16 px-6 max-w-md mx-auto space-y-6 relative z-20">

                {/* Role Switcher Card */}
                <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100/50 backdrop-blur-sm">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{t('workspaceMode')}</h3>
                    <button
                        onClick={toggleRole}
                        className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between group ${role === 'restaurant' ? 'border-slate-800 bg-slate-50' : 'border-emerald-100 bg-white'}`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${role === 'restaurant' ? 'bg-slate-800 text-white' : 'bg-emerald-100 text-emerald-600'}`}>
                                {role === 'restaurant' ? <Utensils size={20} /> : <Building2 size={20} />}
                            </div>
                            <div className="text-left">
                                <span className="block font-bold text-gray-900 leading-tight">
                                    {role === 'restaurant' ? t('commercialKitchen') : t('householdKitchen')}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {role === 'restaurant' ? t('tapToSwitchHome') : t('tapToSwitchRest')}
                                </span>
                            </div>
                        </div>
                        <div className={`w-12 h-6 rounded-full p-1 transition-colors ${role === 'restaurant' ? 'bg-slate-800' : 'bg-gray-200'}`}>
                            <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${role === 'restaurant' ? 'translate-x-6' : 'translate-x-0'}`} />
                        </div>
                    </button>
                </div>

                <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                    {[
                        { icon: Settings, label: t('preferences'), href: "/preferences" },
                        { icon: ShoppingCart, label: t('shoppingList'), href: "/shopping" },
                        { icon: LogOut, label: t('logOut'), color: "text-red-500" }
                    ].map((item, i) => (
                        <Link
                            key={i}
                            href={item.href || "#"}
                            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <item.icon size={20} className={item.color || "text-gray-600"} />
                                <span className={`font-medium ${item.color || "text-gray-900"}`}>{item.label}</span>
                            </div>
                            <ChevronRight size={16} className="text-gray-400" />
                        </Link>
                    ))}
                </div>
            </div>

        </main>
    );
}

