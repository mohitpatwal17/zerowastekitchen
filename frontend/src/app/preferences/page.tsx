"use client";

import { useLocalization } from "@/lib/LocalizationContext";
import { ArrowLeft, Globe, DollarSign, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Preferences() {
    const { language, currency, setLanguage, setCurrency, t } = useLocalization();
    const router = useRouter();

    const currencies: ('USD' | 'INR' | 'EUR' | 'GBP' | 'JPY')[] = ['USD', 'INR', 'EUR', 'GBP', 'JPY'];

    return (
        <main className="min-h-screen bg-slate-50 pb-24">
            <header className="bg-white px-6 py-6 border-b border-gray-100 flex items-center gap-4">
                <Link href="/profile" className="p-2 -ml-2 hover:bg-gray-50 rounded-full">
                    <ArrowLeft size={20} className="text-gray-900" />
                </Link>
                <h1 className="text-xl font-bold text-gray-900">{t('preferences')}</h1>
            </header>

            <div className="px-6 py-8 space-y-8 max-w-md mx-auto">
                {/* Language Section */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-400">
                        <Globe size={16} />
                        <h3 className="text-xs font-bold uppercase tracking-widest">{t('selectLang')}</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { id: 'en', label: t('english') },
                            { id: 'hi', label: t('hindi') }
                        ].map((lang) => (
                            <button
                                key={lang.id}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                onClick={() => setLanguage(lang.id as any)}
                                className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${language === lang.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 bg-white'}`}
                            >
                                <span className={`font-bold ${language === lang.id ? 'text-emerald-700' : 'text-gray-900'}`}>{lang.label}</span>
                                {language === lang.id && <Check size={18} className="text-emerald-500" />}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Currency Section */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-400">
                        <DollarSign size={16} />
                        <h3 className="text-xs font-bold uppercase tracking-widest">{t('selectCurrency')}</h3>
                    </div>
                    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                        {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
                        {currencies.map((curr, idx) => (
                            <button
                                key={curr}
                                onClick={() => setCurrency(curr)}
                                className={`w-full p-5 flex items-center justify-between border-b border-gray-50 last:border-none transition-colors ${currency === curr ? 'bg-emerald-50/30' : 'hover:bg-gray-50'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${currency === curr ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                        {curr === 'INR' ? '₹' : curr === 'USD' ? '$' : curr === 'EUR' ? '€' : curr === 'GBP' ? '£' : '¥'}
                                    </div>
                                    <span className={`font-bold ${currency === curr ? 'text-gray-900' : 'text-gray-500'}`}>{curr}</span>
                                </div>
                                {currency === curr && <Check size={20} className="text-emerald-500" />}
                            </button>
                        ))}
                    </div>
                </section>

                <button
                    onClick={() => router.push('/')}
                    className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-lg shadow-gray-200 active:scale-95 transition-transform"
                >
                    {t('saveSettings')}
                </button>
            </div>

        </main>
    );
}
