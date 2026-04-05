"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations';

type Language = 'en' | 'hi';
type Currency = 'USD' | 'INR' | 'EUR' | 'GBP' | 'JPY';

interface LocalizationContextType {
    language: Language;
    currency: Currency;
    setLanguage: (lang: Language) => void;
    setCurrency: (curr: Currency) => void;
    t: (key: keyof typeof translations['en']) => string;
    formatCurrency: (amount: number) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

const currencySymbols: Record<Currency, string> = {
    USD: '$',
    INR: '₹',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
};

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>('en');
    const [currency, setCurrencyState] = useState<Currency>('USD');

    useEffect(() => {
        const savedLang = localStorage.getItem('appLanguage') as Language;
        const savedCurr = localStorage.getItem('appCurrency') as Currency;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (savedLang) setLanguageState(savedLang);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (savedCurr) setCurrencyState(savedCurr);
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('appLanguage', lang);
    };

    const setCurrency = (curr: Currency) => {
        setCurrencyState(curr);
        localStorage.setItem('appCurrency', curr);
    };

    const t = (key: keyof typeof translations['en']) => {
        return translations[language][key] || translations['en'][key] || key;
    };

    const formatCurrency = (amount: number) => {
        const symbol = currencySymbols[currency];
        return `${symbol}${amount.toLocaleString()}`;
    };

    return (
        <LocalizationContext.Provider value={{ language, currency, setLanguage, setCurrency, t, formatCurrency }}>
            {children}
        </LocalizationContext.Provider>
    );
};

export const useLocalization = () => {
    const context = useContext(LocalizationContext);
    if (context === undefined) {
        throw new Error('useLocalization must be used within a LocalizationProvider');
    }
    return context;
};
