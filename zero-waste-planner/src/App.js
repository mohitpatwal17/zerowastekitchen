// src/App.js
import React, { useState, useMemo, useEffect, useRef } from "react";
import "./App.css";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

/* ---------- Translations for title + nav ---------- */
const STRINGS = {
  en: {
    title: "Zero Waste Kitchen Planner",
    navHome: "Home",
    navInventory: "Inventory",
    navMatches: "Matches",
    navShopping: "Shop",
    navWaste: "Waste",
    navImpact: "Impact",
    navConnect: "Connect",
    navLanguage: "Language",
    navLogin: "Login",
    navManager: "Manager",
    navHelp: "Help",
    navBuilder: "Recipe Builder",
    navAI: "Recipe AI",
    navCompost: "Compost Guide",
    navStorage: "Storage Tips",
    navChatbot: "Chatbot"
  },
  hi: {
    title: "ज़ीरो वेस्ट किचन प्लानर",
    navHome: "होम",
    navInventory: "इन्वेंटरी",
    navMatches: "मैचेज़",
    navShopping: "शॉप",
    navWaste: "वेस्ट",
    navImpact: "इम्पैक्ट",
    navConnect: "कनेक्ट",
    navLanguage: "भाषा",
    navLogin: "लॉगिन",
    navManager: "मैनेजर",
    navHelp: "मदद",
    navBuilder: "रेसिपी बिल्डर",
    navAI: "रेसिपी AI",
    navCompost: "कम्पोस्ट गाइड",
    navStorage: "स्टोरेज टिप्स",
    navChatbot: "चैटबॉट"
  }
};

/* ---------- Demo partners for Connect page ---------- */
const PARTNERS = [
  {
    id: 1,
    name: "City Food Bank",
    city: "Delhi",
    type: "food-bank",
    contact: "+91-98XXXXXX01",
    accepts: "Packaged & fresh (before expiry)"
  },
  {
    id: 2,
    name: "Community Fridge Noida",
    city: "Noida",
    type: "community-fridge",
    contact: "+91-98XXXXXX02",
    accepts: "Cooked & fresh (4h window)"
  },
  {
    id: 3,
    name: "Green Compost Hub",
    city: "Noida",
    type: "compost",
    contact: "+91-98XXXXXX03",
    accepts: "Inedible scraps only"
  }
];

/* ---------- Demo recipes for Matches page ---------- */
const RECOMMENDED_RECIPES = [
  {
    id: 1,
    title: "Sheet Pan Lemon Herb Chicken & Veggies",
    subtitle: "Uses: Chicken, Broccoli",
    score: 9.5,
    time: "25 min",
    difficulty: "Easy"
  },
  {
    id: 2,
    title: "Pesto Pasta with Basil & Tomato",
    subtitle: "Uses: Fresh Basil, Tomatoes",
    score: 9.0,
    time: "20 min",
    difficulty: "Medium"
  },
  {
    id: 3,
    title: "Veggie Stir Fry with Leftover Rice",
    subtitle: "Uses: Rice, Mixed Veggies",
    score: 8.7,
    time: "18 min",
    difficulty: "Easy"
  }
];

/* ---------- Recipe Builder Library ---------- */
const RECIPE_LIBRARY = [
  {
    id: "butter-chicken",
    name: "Butter Chicken",
    cuisine: "Indian",
    baseServings: 2,
    ingredients: [
      { name: "Chicken", amount: 200, unit: "g" },
      { name: "Butter", amount: 30, unit: "g" },
      { name: "Onion", amount: 1, unit: "pc" },
      { name: "Tomato", amount: 2, unit: "pc" },
      { name: "Cream", amount: 30, unit: "ml" }
    ]
  },
  {
    id: "paneer-tikka",
    name: "Paneer Tikka",
    cuisine: "Indian",
    baseServings: 2,
    ingredients: [
      { name: "Paneer", amount: 150, unit: "g" },
      { name: "Curd", amount: 50, unit: "g" },
      { name: "Capsicum", amount: 1, unit: "pc" }
    ]
  },
  {
    id: "veg-hakka-noodles",
    name: "Veg Hakka Noodles",
    cuisine: "Chinese",
    baseServings: 2,
    ingredients: [
      { name: "Noodles", amount: 100, unit: "g" },
      { name: "Cabbage", amount: 50, unit: "g" },
      { name: "Carrot", amount: 1, unit: "pc" },
      { name: "Capsicum", amount: 1, unit: "pc" }
    ]
  },
  {
    id: "white-sauce-pasta",
    name: "White Sauce Pasta",
    cuisine: "Italian",
    baseServings: 2,
    ingredients: [
      { name: "Pasta", amount: 100, unit: "g" },
      { name: "Milk", amount: 150, unit: "ml" },
      { name: "Cheese", amount: 30, unit: "g" }
    ]
  }
];

/* ---------- Compost Guide Map ---------- */
const COMPOST_GUIDE = {
  banana: "Banana peels: Cut into small pieces and mix with dry leaves. Avoid large chunks.",
  "banana peel": "Banana peels: Cut into small pieces and mix with dry leaves. Avoid large chunks.",
  tea: "Used tea leaves: Dry slightly and add directly to compost. Avoid tea bags with plastic.",
  "tea leaves": "Used tea leaves: Dry slightly and add directly to compost. Avoid tea bags with plastic.",
  eggshell: "Eggshells: Rinse, dry, and crush before adding. Good source of calcium.",
  "vegetable scraps":
    "Vegetable scraps: Mix with browns (dry leaves, paper) in 1:2 ratio. Turn compost every week.",
  "fruit scraps":
    "Fruit scraps: Bury in the middle of the pile to avoid flies. Mix with dry matter."
};

/* ---------- Storage Guide Map ---------- */
const STORAGE_GUIDE = {
  meat: "Meat: Store in the freezer in an airtight pack. Use within 3–6 months. In fridge, use within 1–2 days.",
  chicken:
    "Raw chicken: Keep in fridge at 0–4°C for 1–2 days or freeze for up to 6 months in airtight bags.",
  sugar:
    "Sugar: Store in an airtight container in a cool, dry place. Shelf life: 2+ years.",
  rice: "Rice: Uncooked – airtight container, dry place. Cooked – fridge, use within 24–36 hours.",
  milk:
    "Milk: Keep in the coldest part of fridge, not in door. Use within 2–3 days after opening."
};

function App() {
  /* ---------- VIEW / ROLE ---------- */
  const [view, setView] = useState("home");
  const [role, setRole] = useState("manager");
  const [navOpen, setNavOpen] = useState(false);

  /* ---------- HOUSEHOLD INFO ---------- */
  const [userName, setUserName] = useState("Family");
  const [householdName, setHouseholdName] = useState("Zero Waste Home");
  const [monthlySpend, setMonthlySpend] = useState(5000);
  const [streakDays, setStreakDays] = useState(4);

  /* ---------- THEME / ACCESSIBILITY ---------- */
  const [language, setLanguage] = useState("en");
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const strings = STRINGS[language] || STRINGS.en;

  /* ---------- LOADING ANIMATION ---------- */
  const [isLoading, setIsLoading] = useState(true);

  /* ---------- FAMILY MANAGER LOGIN (DEMO) ---------- */
  const [phone, setPhone] = useState("");
  const [householdCode, setHouseholdCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isManagerLoggedIn, setIsManagerLoggedIn] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");

  /* ---------- INVENTORY ---------- */
  const [items, setItems] = useState([
    {
      id: 1,
      name: "Chicken Breast",
      qty: 2,
      unit: "pcs",
      category: "fresh",
      storage: "Fridge",
      purchaseDate: "2025-12-05",
      expiry: "2025-12-10"
    },
    {
      id: 2,
      name: "Broccoli",
      qty: 1,
      unit: "head",
      category: "produce",
      storage: "Fridge",
      purchaseDate: "2025-12-06",
      expiry: "2025-12-11"
    },
    {
      id: 3,
      name: "Fresh Basil",
      qty: 1,
      unit: "bunch",
      category: "herbs",
      storage: "Fridge",
      purchaseDate: "2025-12-08",
      expiry: "2025-12-15"
    }
  ]);
  const [newName, setNewName] = useState("");
  const [newQty, setNewQty] = useState(1);
  const [newUnit, setNewUnit] = useState("pcs");
  const [newCategory, setNewCategory] = useState("produce");
  const [newStorage, setNewStorage] = useState("Fridge");
  const [newPurchaseDate, setNewPurchaseDate] = useState("");
  const [newExpiry, setNewExpiry] = useState("");
  const [inventoryFilter, setInventoryFilter] = useState("all");

  /* ---------- WASTE LOG ---------- */
  const [wasteEntries, setWasteEntries] = useState([
    { id: 1, name: "Bread", reason: "Expired", grams: 60, date: "2025-12-01" },
    { id: 2, name: "Rice", reason: "Leftover", grams: 120, date: "2025-12-02" }
  ]);
  const [wasteName, setWasteName] = useState("");
  const [wasteReason, setWasteReason] = useState("Expired");
  const [wasteGrams, setWasteGrams] = useState("");

  /* ---------- CONNECT PAGE FILTERS ---------- */
  const [connectCity, setConnectCity] = useState("");
  const [connectType, setConnectType] = useState("food-bank");

  /* ---------- SHOPPING LIST ---------- */
  const [shoppingList, setShoppingList] = useState([
    { id: 1, name: "Onions", qty: "2" },
    { id: 2, name: "Milk", qty: "1 L" }
  ]);
  const [shopName, setShopName] = useState("");
  const [shopQty, setShopQty] = useState("");

  /* ---------- VOICE INPUT ---------- */
  const [isListening, setIsListening] = useState(false);

  /* ---------- BARCODE DEMO ---------- */
  const [showBarcodeDemo, setShowBarcodeDemo] = useState(false);
  const videoRef = useRef(null);

  /* ---------- RECIPE SEARCH (Matches) ---------- */
  const [recipeQuery, setRecipeQuery] = useState("");

  /* ---------- RECIPE BUILDER ---------- */
  const [builderDishId, setBuilderDishId] = useState("butter-chicken");
  const [builderServings, setBuilderServings] = useState(2);

  /* ---------- AI RECIPE (DEMO) ---------- */
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResult, setAiResult] = useState("");

  /* ---------- COMPOST GUIDE ---------- */
  const [compostQuery, setCompostQuery] = useState("");

  /* ---------- STORAGE ADVISOR ---------- */
  const [storageQuery, setStorageQuery] = useState("");

  /* ---------- CHATBOT ---------- */
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  const today = new Date();

  /* ========= LOCALSTORAGE: LOAD ONCE ========= */
  useEffect(() => {
    try {
      const raw = localStorage.getItem("zwkp-data");
      if (!raw) return;
      const saved = JSON.parse(raw);

      if (saved.userName) setUserName(saved.userName);
      if (saved.householdName) setHouseholdName(saved.householdName);
      if (typeof saved.monthlySpend === "number")
        setMonthlySpend(saved.monthlySpend);
      if (Array.isArray(saved.items)) setItems(saved.items);
      if (Array.isArray(saved.wasteEntries))
        setWasteEntries(saved.wasteEntries);
      if (Array.isArray(saved.shoppingList))
        setShoppingList(saved.shoppingList);
      if (typeof saved.streakDays === "number")
        setStreakDays(saved.streakDays);
    } catch (err) {
      console.error("Failed to load saved data", err);
    }
  }, []);

  /* ========= LOCALSTORAGE: SAVE WHEN DATA CHANGES ========= */
  useEffect(() => {
    const toSave = {
      userName,
      householdName,
      monthlySpend,
      items,
      wasteEntries,
      shoppingList,
      streakDays
    };
    try {
      localStorage.setItem("zwkp-data", JSON.stringify(toSave));
    } catch (err) {
      console.error("Failed to save data", err);
    }
  }, [userName, householdName, monthlySpend, items, wasteEntries, shoppingList, streakDays]);

  /* ---------- LOADER ---------- */
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  /* ---------- CAMERA EFFECT (BARCODE PREVIEW) ---------- */
  useEffect(() => {
    let stream;
    const videoElement = videoRef.current;

    async function startCamera() {
      if (!showBarcodeDemo || !navigator.mediaDevices || !videoElement) return;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }
        });
        videoElement.srcObject = stream;
        await videoElement.play();
      } catch (err) {
        console.error("Camera error", err);
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
      if (videoElement && videoElement.srcObject) {
        const tracks = videoElement.srcObject.getTracks();
        tracks.forEach((t) => t.stop());
        videoElement.srcObject = null;
      }
    };
  }, [showBarcodeDemo]);

  /* ---------- INVENTORY DERIVED ---------- */
  const sortedItems = useMemo(
    () => [...items].sort((a, b) => new Date(a.expiry) - new Date(b.expiry)),
    [items]
  );

  const filteredInventory = sortedItems.filter((item) => {
    if (inventoryFilter === "all") return true;
    return item.category === inventoryFilter;
  });

  const topUrgent = sortedItems.slice(0, 3);

  function daysLeft(dateStr) {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return NaN;
    const diff = Math.ceil((d - today) / (1000 * 60 * 60 * 24));
    return diff;
  }

  function labelForExpiry(dateStr) {
    const d = daysLeft(dateStr);
    if (isNaN(d)) return "-";
    if (d < 0) return "EXPIRED";
    if (d === 0) return "TODAY";
    if (d <= 3) return `${d} DAYS`;
    return "1+ WEEK";
  }

  /* ---------- WASTE / IMPACT DERIVED ---------- */
  const totalWasteGrams = wasteEntries.reduce(
    (sum, w) => sum + (w.grams || 0),
    0
  );
  const totalWasteKg = totalWasteGrams / 1000;
  const moneyLost = totalWasteKg * 80;
  const moneySaved = Math.max(0, monthlySpend - moneyLost);
  const co2Lost = totalWasteKg * 2.5;
  const waterLost = totalWasteKg * 1500;

  const impactCard = {
    moneySaved: moneySaved.toFixed(0),
    co2Saved: Math.max(0, (monthlySpend / 1000) * 5).toFixed(1),
    waterSaved: Math.max(0, (monthlySpend / 1000) * 1500).toFixed(0)
  };

  const scrapFreeWeek = totalWasteKg < 0.2;
  const lowWasteChampion = totalWasteKg < 0.5;
  const heavyWaster = totalWasteKg > 2;

  const reasonCounts = wasteEntries.reduce(
    (acc, w) => {
      acc[w.reason] = (acc[w.reason] || 0) + w.grams;
      return acc;
    },
    {}
  );

  const spend = monthlySpend || 1;
  const lossPercent = Math.min(100, (moneyLost / spend) * 100);
  const savedPercent = Math.min(100, (moneySaved / spend) * 100);

  /* ---------- IMPACT PIE CHART DATA ---------- */
  const impactPieData = {
    labels: ["Estimated Saved (₹)", "Estimated Lost to Waste (₹)"],
    datasets: [
      {
        data: [
          Math.max(0, Math.round(moneySaved)),
          Math.max(0, Math.round(moneyLost))
        ],
        backgroundColor: ["#22c55e", "#ef4444"],
        borderWidth: 0
      }
    ]
  };

  /* ---------- RECIPE FILTERED LIST ---------- */
  const filteredRecipes = recipeQuery
    ? RECOMMENDED_RECIPES.filter(
        (r) =>
          r.title.toLowerCase().includes(recipeQuery.toLowerCase()) ||
          r.subtitle.toLowerCase().includes(recipeQuery.toLowerCase())
      )
    : RECOMMENDED_RECIPES;

  /* ---------- CONNECT FILTERED PARTNERS ---------- */
  const filteredPartners = useMemo(() => {
    return PARTNERS.filter((p) => {
      const cityMatch = connectCity
        ? p.city.toLowerCase().includes(connectCity.toLowerCase())
        : true;
      const typeMatch = connectType ? p.type === connectType : true;
      return cityMatch && typeMatch;
    });
  }, [connectCity, connectType]);

  /* ---------- HANDLERS: INVENTORY ---------- */
  function handleAddItem(e) {
    e.preventDefault();
    if (!newName || !newExpiry) return;
    const next = {
      id: Date.now(),
      name: newName,
      qty: Number(newQty),
      unit: newUnit,
      category: newCategory,
      storage: newStorage,
      purchaseDate: newPurchaseDate || null,
      expiry: newExpiry
    };
    setItems([...items, next]);
    setNewName("");
    setNewQty(1);
    setNewUnit("pcs");
    setNewCategory("produce");
    setNewStorage("Fridge");
    setNewPurchaseDate("");
    setNewExpiry("");
  }

  function handleDeleteItem(id) {
    setItems(items.filter((i) => i.id !== id));
  }

  /* ---------- HANDLERS: WASTE ---------- */
  function handleAddWaste(e) {
    e.preventDefault();
    if (!wasteName || !wasteGrams) return;
    const entry = {
      id: Date.now(),
      name: wasteName,
      reason: wasteReason,
      grams: Number(wasteGrams),
      date: new Date().toISOString().slice(0, 10)
    };
    setWasteEntries([entry, ...wasteEntries]);
    setWasteName("");
    setWasteGrams("");
    setWasteReason("Expired");
  }

  /* ---------- HANDLERS: LOGIN DEMO ---------- */
  function sendOtpDemo(e) {
    e.preventDefault();
    if (!phone || !householdCode) {
      setLoginMessage("Enter phone and household code first.");
      return;
    }
    setOtpSent(true);
    setLoginMessage("Demo mode: OTP is 123456.");
  }

  function verifyOtpDemo(e) {
    e.preventDefault();
    if (otp === "123456") {
      setIsManagerLoggedIn(true);
      setRole("manager");
      setLoginMessage("Logged in as Family Manager.");
      setView("home");
      setNavOpen(false);
    } else {
      setLoginMessage("Incorrect OTP. In demo, use 123456.");
    }
  }

  function handleLogout() {
    setIsManagerLoggedIn(false);
    setRole("member");
    setLoginMessage("Logged out.");
  }

  function handleDownloadData() {
    const data = {
      userName,
      householdName,
      monthlySpend,
      items,
      wasteEntries,
      shoppingList,
      streakDays
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "zero-waste-data.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleDeleteData() {
    if (!window.confirm("Delete all inventory & waste data from this device?"))
      return;
    setItems([]);
    setWasteEntries([]);
    setShoppingList([]);
    try {
      localStorage.removeItem("zwkp-data");
    } catch (err) {
      console.error("Failed to clear saved data", err);
    }
  }

  /* ---------- HANDLERS: NAV + LOADER ---------- */
  function handleNavChange(id) {
    if (view === id) {
      setNavOpen(false);
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setView(id);
      setIsLoading(false);
      setNavOpen(false);
    }, 400);
  }

  /* ---------- BACK TO HOME BUTTON ---------- */
  const BackToHome = () => (
    <button
      type="button"
      className="back-btn"
      onClick={() => handleNavChange("home")}
    >
      ← Back to Home
    </button>
  );

  /* ---------- HANDLERS: SHOPPING LIST ---------- */
  function handleAddShoppingItem(e) {
    e.preventDefault();
    if (!shopName.trim()) return;
    const item = {
      id: Date.now(),
      name: shopName.trim(),
      qty: shopQty.trim() || "1"
    };
    setShoppingList([...shoppingList, item]);
    setShopName("");
    setShopQty("");
  }

  function handleRemoveShoppingItem(id) {
    setShoppingList(shoppingList.filter((i) => i.id !== id));
  }

  function handlePrintShoppingList() {
    window.print();
  }

  /* ---------- HANDLERS: VOICE INPUT ---------- */
  function handleVoiceAdd() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = language === "hi" ? "hi-IN" : "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setNewName(text);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  }

  /* ---------- HANDLERS: STREAK ADJUST ---------- */
  function adjustStreak(delta) {
    setStreakDays((prev) => Math.max(0, prev + delta));
  }

  /* ---------- HANDLERS: RECIPE BUILDER SHARE ---------- */
  function getBuilderRecipeText(selected) {
    const multiplier = builderServings / selected.baseServings;
    const lines = selected.ingredients.map((ing) => {
      const amt = (ing.amount * multiplier).toFixed(1).replace(/\.0$/, "");
      return `- ${ing.name}: ${amt} ${ing.unit}`;
    });
    return `Recipe: ${selected.name} (${selected.cuisine}) for ${builderServings} people\n` + lines.join("\n");
  }

  async function handleShareRecipe(selected) {
    const text = getBuilderRecipeText(selected);
    if (navigator.share) {
      try {
        await navigator.share({ title: selected.name, text });
      } catch {
        // ignore
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        alert("Recipe copied to clipboard!");
      } catch {
        alert("Could not copy. Please select & copy manually.");
      }
    } else {
      alert("Sharing not supported in this browser.");
    }
  }

  /* ---------- HANDLERS: AI RECIPE (DEMO) ---------- */
  function handleGenerateAIRecipe() {
    if (!aiPrompt.trim()) {
      setAiResult("Please describe what you want to cook (e.g., 'pasta with veggies').");
      return;
    }
    const dish = aiPrompt.trim();
    setAiResult(
      `Here is a simple plan for "${dish}":

1. Ingredients (approx):
- Main: 200–250 g of ${dish.split(" ")[0] || "ingredient"}
- Vegetables: 1 cup mixed
- Spices: Salt, pepper, chilli (to taste)
- Oil: 1–2 tbsp

2. Steps:
- Prep: Chop vegetables and gather all ingredients.
- Cook base: Heat oil, sauté onion/garlic if used.
- Add main ingredient: Cook until almost done.
- Add vegetables and spices: Stir-fry / simmer for 5–10 minutes.
- Taste & adjust: Check salt, spice, and consistency.
- Serve hot and garnish with herbs.

This is a local demo “AI-style” helper — in a full system this would call a real recipe API or LLM.`
    );
  }

  /* ---------- HELPERS: COMPOST & STORAGE LOOKUP ---------- */
  function getCompostAdvice(query) {
    if (!query.trim()) return "";
    const q = query.toLowerCase();
    for (const key of Object.keys(COMPOST_GUIDE)) {
      if (q.includes(key)) return COMPOST_GUIDE[key];
    }
    return "General tip: Most fruit & vegetable scraps, coffee grounds, and dry leaves are compostable. Avoid meat, dairy, and oily foods in basic home compost.";
  }

  function getStorageAdvice(query) {
    if (!query.trim()) return "";
    const q = query.toLowerCase();
    for (const key of Object.keys(STORAGE_GUIDE)) {
      if (q.includes(key)) return STORAGE_GUIDE[key];
    }
    return "Store food in clean, airtight containers. Keep perishable items in the fridge, and always label with date to track freshness.";
  }

  /* ---------- CHATBOT ---------- */
  function getBotReply(message) {
    const text = message.toLowerCase();
    if (text.includes("compost"))
      return "For compost: separate wet (kitchen scraps) and dry (leaves, paper) and keep a 1:2 ratio. Avoid meat and oily foods.";
    if (text.includes("store") || text.includes("storage"))
      return "General storage rule: cold for perishables (fridge/freezer), cool & dry for grains and sugar, airtight containers whenever possible.";
    if (text.includes("waste"))
      return "Try to log your waste in the Waste tab and review the Impact dashboard weekly to see progress.";
    if (text.includes("recipe"))
      return "Use Matches for suggested recipes, Recipe Builder to scale servings, or Recipe AI to describe what you want to cook.";
    if (text.includes("hello") || text.includes("hi"))
      return "Hi! I’m your Zero Waste helper. Ask me about recipes, compost, storage, or waste reduction.";
    return "I’m a simple on-device helper. Ask me about recipes, compost, storage, or how to use a specific section of the app.";
  }

  function handleSendChat() {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    const botMsg = getBotReply(userMsg);
    setChatMessages((prev) => [...prev, { user: userMsg, bot: botMsg }]);
    setChatInput("");
  }

  /* ---------- LABELS & NAV BUTTONS ---------- */
  const roleLabel =
    isManagerLoggedIn && role === "manager"
      ? "Family Manager"
      : "Household Member";

  const navButton = (id, label, icon) => (
    <button
      key={id}
      className={`nav-btn ${view === id ? "nav-btn-active" : ""}`}
      onClick={() => handleNavChange(id)}
      type="button"
    >
      <span className="nav-icon">{icon}</span>
      <span>{label}</span>
    </button>
  );

  /* ---------- JSX ---------- */
  return (
    <div
      className={`app ${highContrast ? "app-contrast" : ""} ${
        largeText ? "app-large-text" : ""
      }`}
    >
      {/* LOADING OVERLAY */}
      {isLoading && (
        <div className="loader-overlay">
          <div className="loader-card">
            <div className="spinner" />
            <p className="loader-text">Setting up your kitchen…</p>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="header">
        <div className="header-top-row">
          <button
            type="button"
            className="menu-btn"
            onClick={() => setNavOpen(true)}
            aria-label="Open navigation menu"
          >
            ☰
          </button>

          <div className="title-block">
            <h1>{strings.title}</h1>
            <p className="subtitle">
              {roleLabel} • {householdName}
            </p>
          </div>

          <button
            type="button"
            className="dark-toggle-btn"
            onClick={() => setHighContrast((prev) => !prev)}
            aria-label="Toggle dark mode"
          >
            {highContrast ? "☀️" : "🌙"}
          </button>
        </div>
      </header>

      {/* SIDE NAV DRAWER */}
      {navOpen && (
        <div className="side-nav-overlay" onClick={() => setNavOpen(false)}>
          <aside
            className="side-nav"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="side-nav-header">
              <h2>Menu</h2>
              <button
                type="button"
                className="side-nav-close"
                onClick={() => setNavOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="side-nav-body">
              {navButton("home", strings.navHome, "🏠")}
              {navButton("inventory", strings.navInventory, "📦")}
              {navButton("matches", strings.navMatches, "🍲")}
              {navButton("shopping", strings.navShopping, "🛒")}
              {navButton("waste", strings.navWaste, "🗑️")}
              {navButton("impact", strings.navImpact, "📊")}
              {navButton("connect", strings.navConnect, "🤝")}
              {navButton("language", strings.navLanguage, "🌐")}
              {navButton("help", strings.navHelp, "❓")}
              {navButton("builder", strings.navBuilder, "📐")}
              {navButton("ai", strings.navAI, "🤖")}
              {navButton("compost", strings.navCompost, "🌱")}
              {navButton("storage", strings.navStorage, "🧊")}
              {navButton("chatbot", strings.navChatbot, "💬")}
              {navButton(
                "login",
                isManagerLoggedIn ? strings.navManager : strings.navLogin,
                "👤"
              )}
            </div>
          </aside>
        </div>
      )}

      {/* MAIN */}
      <main>
        {/* HOME VIEW */}
        {view === "home" && (
          <div className="home-layout">
            <section className="card greeting-card">
              <div className="greeting-top">
                <div>
                  <div className="chip chip-soft">{roleLabel}</div>
                  <h2 className="hello-text">Hello, {userName} 👋</h2>
                  <p className="muted small">
                    Let&apos;s use at-risk ingredients before they expire today.
                  </p>
                </div>
                <div className="streak-pill">
                  🔥 Streak: <strong>{streakDays} days</strong>
                  <div className="streak-controls">
                    <button
                      type="button"
                      className="streak-btn"
                      onClick={() => adjustStreak(-1)}
                    >
                      −
                    </button>
                    <button
                      type="button"
                      className="streak-btn"
                      onClick={() => adjustStreak(1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="settings-row">
                <input
                  className="settings-input"
                  type="text"
                  placeholder="Your name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
                <input
                  className="settings-input"
                  type="text"
                  placeholder="Household name"
                  value={householdName}
                  onChange={(e) => setHouseholdName(e.target.value)}
                />
              </div>
              <div className="settings-row">
                <input
                  className="settings-input"
                  type="number"
                  min="0"
                  placeholder="Monthly spend (₹)"
                  value={monthlySpend}
                  onChange={(e) =>
                    setMonthlySpend(Number(e.target.value) || 0)
                  }
                />
              </div>

              <div className="impact-row">
                <div className="impact-card">
                  <span className="impact-label">Saved this month</span>
                  <span className="impact-value">
                    ₹{impactCard.moneySaved}
                  </span>
                </div>
                <div className="impact-card">
                  <span className="impact-label">CO₂e avoided</span>
                  <span className="impact-value">
                    {impactCard.co2Saved} kg
                  </span>
                </div>
                <div className="impact-card">
                  <span className="impact-label">Water conserved</span>
                  <span className="impact-value">
                    {impactCard.waterSaved} L
                  </span>
                </div>
              </div>
            </section>

            {/* Use-Next strip */}
            <section className="card">
              <div className="section-header">
                <h2>Use Next ⏱️</h2>
                <span className="muted small">
                  Items closest to expiry are highlighted.
                </span>
              </div>
              <div className="use-next-row">
                {topUrgent.length === 0 && (
                  <p className="muted small">
                    No items yet — add something to your inventory.
                  </p>
                )}
                {topUrgent.map((item) => (
                  <div key={item.id} className="use-next-chip">
                    <div className="use-next-badge">
                      {labelForExpiry(item.expiry)}
                    </div>
                    <div className="use-next-name">{item.name}</div>
                    <div className="use-next-qty">
                      {item.qty} {item.unit}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recipes + HOW IT WORKS text */}
            <section className="card">
              <div className="section-header">
                <h2>Smart Matches 🍽️</h2>
                <span className="muted small">
                  Recipes that use up at-risk ingredients first.
                </span>
              </div>

              <form className="form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Search recipes by ingredient (demo)"
                    value={recipeQuery}
                    onChange={(e) => setRecipeQuery(e.target.value)}
                  />
                </div>
                <p className="small muted">
                  In a production version this would call a live recipe API and
                  fetch results.
                </p>
              </form>

              <div className="recipes-grid">
                {filteredRecipes.map((r) => (
                  <div key={r.id} className="recipe-card">
                    <div className="recipe-body">
                      <h3>{r.title}</h3>
                      <p className="muted small">{r.subtitle}</p>
                      <div className="recipe-meta">
                        <span className="recipe-score">
                          Use-Next: {r.score.toFixed(1)}
                        </span>
                        <span className="muted small">
                          {r.time} • {r.difficulty}
                        </span>
                      </div>
                    </div>
                    <div className="recipe-actions">
                      <button
                        className="primary-btn small-btn"
                        type="button"
                      >
                        Cook Now
                      </button>
                      <button
                        className="ghost-btn small-btn"
                        type="button"
                      >
                        Add to Plan
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <p className="small muted" style={{ marginTop: 6 }}>
                How it works (high level): items close to expiry are ranked,
                then recipes are scored by how many of those items they use.
                Missing ingredients are added to the Shop tab as &quot;right
                sized&quot; gaps so you only buy what is needed.
              </p>
            </section>

            {/* Bottom quick actions */}
            <section className="bottom-actions">
              <button className="bottom-btn" type="button">
                🧾 Plan Week
              </button>
              <button
                className="bottom-btn"
                type="button"
                onClick={() => handleNavChange("shopping")}
              >
                🛒 Smart Shop
              </button>
              <button
                className="bottom-btn"
                type="button"
                onClick={() => handleNavChange("connect")}
              >
                🤝 Donate
              </button>
              <button
                className="bottom-btn"
                type="button"
                onClick={() => handleNavChange("compost")}
              >
                🌱 Compost
              </button>
            </section>
          </div>
        )}

        {/* INVENTORY VIEW */}
        {view === "inventory" && (
          <section className="card">
            <BackToHome />
            <h2>Inventory 📦</h2>
            <p className="muted small">
              Track where items live, when they were opened, and when they
              expire.
            </p>

            <div className="inventory-tools-row">
              <button
                type="button"
                className={`ghost-btn voice-btn ${
                  isListening ? "voice-btn-active" : ""
                }`}
                onClick={handleVoiceAdd}
              >
                🎙 Voice Add (beta)
              </button>
              <button
                type="button"
                className="ghost-btn"
                onClick={() => setShowBarcodeDemo(true)}
              >
                📷 Barcode Scan (demo)
              </button>
            </div>

            <div className="filter-row">
              {[
                "all",
                "produce",
                "dairy",
                "pantry",
                "freezer",
                "herbs",
                "fresh"
              ].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`filter-chip ${
                    inventoryFilter === cat ? "filter-chip-active" : ""
                  }`}
                  onClick={() => setInventoryFilter(cat)}
                >
                  {cat === "all"
                    ? "All"
                    : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>

            <form className="form" onSubmit={handleAddItem}>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Item name (e.g., Curd, Apples)"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div className="form-row two">
                <input
                  type="number"
                  min="0"
                  value={newQty}
                  onChange={(e) => setNewQty(e.target.value)}
                  placeholder="Qty"
                />
                <input
                  type="text"
                  value={newUnit}
                  onChange={(e) => setNewUnit(e.target.value)}
                  placeholder="Unit (kg, L, pcs…)"
                />
              </div>
              <div className="form-row two">
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                >
                  <option value="produce">Produce</option>
                  <option value="dairy">Dairy</option>
                  <option value="pantry">Pantry</option>
                  <option value="freezer">Freezer</option>
                  <option value="herbs">Herbs</option>
                  <option value="fresh">Fresh</option>
                </select>
                <select
                  value={newStorage}
                  onChange={(e) => setNewStorage(e.target.value)}
                >
                  <option value="Fridge">Fridge</option>
                  <option value="Freezer">Freezer</option>
                  <option value="Pantry">Pantry</option>
                </select>
              </div>
              <div className="form-row two">
                <div>
                  <label className="muted small">Purchase / Open</label>
                  <input
                    type="date"
                    value={newPurchaseDate}
                    onChange={(e) => setNewPurchaseDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="muted small">Expiry / Best-before</label>
                  <input
                    type="date"
                    value={newExpiry}
                    onChange={(e) => setNewExpiry(e.target.value)}
                  />
                </div>
              </div>
              <button type="submit" className="primary-btn">
                + Add to Inventory
              </button>
            </form>

            <hr className="divider" />

            <h3>Items</h3>
            {filteredInventory.length === 0 ? (
              <p className="muted small">No items in this view.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Qty</th>
                    <th>Category</th>
                    <th>Storage</th>
                    <th>Expiry</th>
                    <th>Status</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>
                        {item.qty} {item.unit}
                      </td>
                      <td>{item.category}</td>
                      <td>{item.storage}</td>
                      <td>{item.expiry}</td>
                      <td>{labelForExpiry(item.expiry)}</td>
                      <td>
                        <button
                          type="button"
                          className="link-btn"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        )}

        {/* MATCHES VIEW */}
        {view === "matches" && (
          <section className="card">
            <BackToHome />
            <h2>Matches & Planner 🍲</h2>
            <p className="muted small">
              Recipes ranked by how many at-risk ingredients they use.
            </p>

            <form className="form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Search recipes by ingredient (demo)"
                  value={recipeQuery}
                  onChange={(e) => setRecipeQuery(e.target.value)}
                />
              </div>
            </form>

            {filteredRecipes.map((r) => (
              <div key={r.id} className="recipe-card">
                <div className="recipe-body">
                  <h3>{r.title}</h3>
                  <p className="muted small">{r.subtitle}</p>
                  <div className="recipe-meta">
                    <span className="recipe-score">
                      Use-Next: {r.score.toFixed(1)}
                    </span>
                    <span className="muted small">
                      {r.time} • {r.difficulty}
                    </span>
                  </div>
                </div>
                <div className="recipe-actions">
                  <button className="primary-btn small-btn" type="button">
                    Cook Now
                  </button>
                  <button className="ghost-btn small-btn" type="button">
                    Add to Plan
                  </button>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* SHOPPING LIST VIEW */}
        {view === "shopping" && (
          <section className="card shopping-card shopping-print-area">
            <BackToHome />
            <div className="section-header">
              <h2>Shopping List 🛒</h2>
              <span className="muted small">
                Right-sized gaps for your current plan.
              </span>
            </div>

            <form className="form" onSubmit={handleAddShoppingItem}>
              <div className="form-row two">
                <input
                  type="text"
                  placeholder="Item to buy"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Qty"
                  value={shopQty}
                  onChange={(e) => setShopQty(e.target.value)}
                />
              </div>
              <button type="submit" className="primary-btn small-btn">
                + Add to List
              </button>
            </form>

            {shoppingList.length === 0 ? (
              <p className="muted small">
                No gaps yet — matches will add missing items here.
              </p>
            ) : (
              <ul className="shopping-list">
                {shoppingList.map((item) => (
                  <li key={item.id}>
                    <span>{item.name}</span>
                    <span className="shopping-qty">{item.qty}</span>
                    <button
                      type="button"
                      className="link-btn"
                      onClick={() => handleRemoveShoppingItem(item.id)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <button
              type="button"
              className="ghost-btn"
              onClick={handlePrintShoppingList}
            >
              🖨 Print / Export (only this list)
            </button>
          </section>
        )}

        {/* WASTE LOG VIEW */}
        {view === "waste" && (
          <section className="card">
            <BackToHome />
            <h2>Waste Log 🗑️</h2>
            <p className="muted small">
              Capture what was wasted and why. Over time this shifts from
              &quot;Expired&quot; to smarter planning.
            </p>

            <form className="form" onSubmit={handleAddWaste}>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Item name (e.g., Bread, Rice)"
                  value={wasteName}
                  onChange={(e) => setWasteName(e.target.value)}
                />
              </div>
              <div className="form-row two">
                <select
                  value={wasteReason}
                  onChange={(e) => setWasteReason(e.target.value)}
                >
                  <option value="Expired">Expired</option>
                  <option value="Leftover">Leftover</option>
                  <option value="Overcooked">Overcooked</option>
                  <option value="Prep scraps">Prep scraps</option>
                </select>
                <input
                  type="number"
                  min="0"
                  placeholder="Amount (grams)"
                  value={wasteGrams}
                  onChange={(e) => setWasteGrams(e.target.value)}
                />
              </div>
              <button type="submit" className="primary-btn">
                + Add Waste Entry
              </button>
            </form>

            <hr className="divider" />

            <div className="waste-stats-row">
              <div className="waste-stat-card">
                <span className="waste-stat-label">Total logged</span>
                <span className="waste-stat-value">
                  {totalWasteKg.toFixed(2)} kg
                </span>
              </div>
              <div className="waste-stat-card">
                <span className="waste-stat-label">Top reason</span>
                <span className="waste-stat-value">
                  {Object.keys(reasonCounts).length === 0
                    ? "—"
                    : Object.entries(reasonCounts).sort(
                        (a, b) => b[1] - a[1]
                      )[0][0]}
                </span>
              </div>
            </div>

            <h3>Recent Waste</h3>
            {wasteEntries.length === 0 ? (
              <p className="muted small">No waste logged yet.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Item</th>
                    <th>Reason</th>
                    <th>Amount (g)</th>
                  </tr>
                </thead>
                <tbody>
                  {wasteEntries.map((w) => (
                    <tr key={w.id}>
                      <td>{w.date}</td>
                      <td>{w.name}</td>
                      <td>{w.reason}</td>
                      <td>{w.grams}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        )}

        {/* IMPACT VIEW */}
        {view === "impact" && (
          <section className="card">
            <BackToHome />
            <h2>Impact Dashboard 📊</h2>
            <p className="muted small">
              This summarizes money lost to waste, money saved, and resource
              impact from your log.
            </p>
            <ul className="list">
              <li>
                Monthly grocery spend (you set):{" "}
                <strong>₹{monthlySpend}</strong>
              </li>
              <li>
                Total food wasted (from log):{" "}
                <strong>{totalWasteKg.toFixed(2)} kg</strong>
              </li>
              <li>
                Money lost to waste (approx):{" "}
                <strong>₹{moneyLost.toFixed(0)}</strong>
              </li>
              <li>
                Money saved (spend − waste):{" "}
                <strong>₹{moneySaved.toFixed(0)}</strong>
              </li>
              <li>
                CO₂ impact of waste (approx):{" "}
                <strong>{co2Lost.toFixed(1)} kg</strong>
              </li>
              <li>
                Water footprint of waste (approx):{" "}
                <strong>{waterLost.toFixed(0)} L</strong>
              </li>
            </ul>

            {/* PIE CHART */}
            <div className="impact-pie-wrapper">
              <Pie data={impactPieData} />
            </div>

            {/* BAR CHART STYLE BARS */}
            <div className="impact-graph">
              <div className="impact-bar">
                <div
                  className="impact-bar-fill loss"
                  style={{ height: `${lossPercent || 0}%` }}
                />
                <span className="impact-bar-label">Waste %</span>
              </div>
              <div className="impact-bar">
                <div
                  className="impact-bar-fill saved"
                  style={{ height: `${savedPercent || 0}%` }}
                />
                <span className="impact-bar-label">Saved %</span>
              </div>
            </div>
            <p className="small muted">
              Bars show waste vs saved percentage of your monthly budget.
            </p>

            <div className="badge-row">
              {scrapFreeWeek && (
                <span className="badge-pill">🏅 Scrap-Free Week</span>
              )}
              {lowWasteChampion && (
                <span className="badge-pill">🌟 Low Waste Champion</span>
              )}
              {heavyWaster && (
                <span className="badge-pill badge-pill-danger">
                  ⚠️ High Waste – Planner Needed
                </span>
              )}
            </div>

            <div className="card impact-note-card">
              <h3 className="small">Research Build – 12-week Pilot (Demo)</h3>
              <p className="small muted">
                In a full deployment, this dashboard would compare baseline
                waste vs week 4 and week 12, showing percentage reduction in
                edible waste and grocery spend. This prototype focuses on
                logging, basic impact math, and habit feedback badges that can
                be used in a small pilot study.
              </p>
            </div>
          </section>
        )}

        {/* CONNECT PAGE */}
        {view === "connect" && (
          <section className="card">
            <BackToHome />
            <h2>Connect with Partners 🤝</h2>
            <p className="muted small">
              Find food banks, community fridges, and compost hubs near you to
              move surplus food out of landfill.
            </p>

            <form className="form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="City (e.g., Noida, Delhi)"
                  value={connectCity}
                  onChange={(e) => setConnectCity(e.target.value)}
                />
              </div>
              <div className="form-row">
                <select
                  value={connectType}
                  onChange={(e) => setConnectType(e.target.value)}
                >
                  <option value="food-bank">Food bank</option>
                  <option value="community-fridge">Community fridge</option>
                  <option value="compost">Compost drop-off</option>
                </select>
              </div>
            </form>

            <h3>Matches</h3>
            {filteredPartners.length === 0 ? (
              <p className="muted small">
                No partners in this filter yet (demo data). In production this
                would query a real API.
              </p>
            ) : (
              <ul className="list">
                {filteredPartners.map((p) => (
                  <li key={p.id}>
                    <strong>{p.name}</strong> – {p.city} ({p.type})
                    <br />
                    <span className="small">
                      Contact: demo {p.contact}
                    </span>
                    <br />
                    <span className="small">Accepts: {p.accepts}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* LANGUAGE & ACCESSIBILITY */}
        {view === "language" && (
          <section className="card">
            <BackToHome />
            <h2>Language & Accessibility 🌐</h2>
            <p className="muted small">
              Configure language, contrast, and touch size.
            </p>

            <div className="form">
              <div className="form-row">
                <label className="muted small">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="es">Spanish (demo)</option>
                  <option value="other">Other (demo)</option>
                </select>
              </div>

              <div className="form-row two">
                <label className="muted small">
                  <input
                    type="checkbox"
                    checked={highContrast}
                    onChange={(e) => setHighContrast(e.target.checked)}
                    style={{ marginRight: 6 }}
                  />
                  High contrast / Dark mode
                </label>
                <label className="muted small">
                  <input
                    type="checkbox"
                    checked={largeText}
                    onChange={(e) => setLargeText(e.target.checked)}
                    style={{ marginRight: 6 }}
                  />
                  Larger touch targets
                </label>
              </div>
            </div>
          </section>
        )}

        {/* HELP PAGE */}
        {view === "help" && (
          <section className="card">
            <BackToHome />
            <h2>Help & How to Use ❓</h2>
            <p className="muted small">
              Quick guide for new users and for your viva demonstration.
            </p>
            <ul className="list">
              <li>
                <strong>Home:</strong> Shows streak, money & impact, and
                &quot;Use Next&quot; items to cook soon.
              </li>
              <li>
                <strong>Inventory:</strong> Add items with expiry dates. Voice
                add and barcode scan are demo features.
              </li>
              <li>
                <strong>Matches:</strong> Suggests recipes that use up
                near-expiry items first.
              </li>
              <li>
                <strong>Shop:</strong> Only the missing ingredients go into a
                right-sized shopping list (print-only list works from here).
              </li>
              <li>
                <strong>Waste & Impact:</strong> Log what was wasted and see
                money, CO₂, and water impact plus badges.
              </li>
              <li>
                <strong>Recipe Builder & AI:</strong> Build your own dishes with
                scaled ingredients or describe a dish to get a quick method.
              </li>
              <li>
                <strong>Compost & Storage:</strong> Ask how to compost or where
                to store common foods so they last longer.
              </li>
              <li>
                <strong>Chatbot:</strong> Ask simple questions about recipes,
                compost, storage, or waste reduction.
              </li>
            </ul>
          </section>
        )}

        {/* RECIPE BUILDER */}
        {view === "builder" && (
          <section className="card">
            <BackToHome />
            <h2>Custom Recipe Builder 📐</h2>
            <p className="muted small">
              Choose a dish, set number of people, and see scaled ingredients.
            </p>

            <div className="form">
              <div className="form-row">
                <label className="muted small">Cuisine</label>
                <select
                  value={builderDishId}
                  onChange={(e) => setBuilderDishId(e.target.value)}
                >
                  {RECIPE_LIBRARY.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.cuisine})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <label className="muted small">Number of people</label>
                <input
                  type="number"
                  min="1"
                  value={builderServings}
                  onChange={(e) =>
                    setBuilderServings(
                      Math.max(1, Number(e.target.value) || 1)
                    )
                  }
                />
              </div>
            </div>

            {(() => {
              const selected =
                RECIPE_LIBRARY.find((r) => r.id === builderDishId) ||
                RECIPE_LIBRARY[0];
              const multiplier =
                builderServings / selected.baseServings || 1;
              return (
                <>
                  <h3>
                    Ingredients for {builderServings} people –{" "}
                    <span className="muted small">
                      base: {selected.baseServings}
                    </span>
                  </h3>
                  <ul className="list">
                    {selected.ingredients.map((ing) => {
                      const amt = (
                        ing.amount * multiplier
                      ).toFixed(1).replace(/\.0$/, "");
                      return (
                        <li key={ing.name}>
                          {ing.name}: <strong>{amt}</strong> {ing.unit}
                        </li>
                      );
                    })}
                  </ul>
                  <button
                    type="button"
                    className="ghost-btn"
                    onClick={() => handleShareRecipe(selected)}
                  >
                    📤 Share / Copy Recipe
                  </button>
                </>
              );
            })()}
          </section>
        )}

        {/* AI RECIPE VIEW */}
        {view === "ai" && (
          <section className="card">
            <BackToHome />
            <h2>Recipe Assistant 🤖</h2>
            <p className="muted small">
              Describe what you want to cook (e.g., &quot;spicy veg pasta&quot;)
              and get a simple plan. This is an offline demo.
            </p>
            <div className="form">
              <div className="form-row">
                <textarea
                  rows={3}
                  placeholder="I want to make..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="textarea"
                />
              </div>
              <button
                type="button"
                className="primary-btn"
                onClick={handleGenerateAIRecipe}
              >
                Generate Idea
              </button>
            </div>
            {aiResult && (
              <div className="ai-result">
                <pre>{aiResult}</pre>
              </div>
            )}
          </section>
        )}

        {/* COMPOST GUIDE */}
        {view === "compost" && (
          <section className="card">
            <BackToHome />
            <h2>Compost Guide 🌱</h2>
            <p className="muted small">
              Type what you want to compost (e.g., banana peel, tea leaves,
              vegetable scraps).
            </p>
            <div className="form">
              <div className="form-row">
                <input
                  type="text"
                  placeholder="What do you want to compost?"
                  value={compostQuery}
                  onChange={(e) => setCompostQuery(e.target.value)}
                />
              </div>
            </div>
            {compostQuery && (
              <p className="small">
                {getCompostAdvice(compostQuery)}
              </p>
            )}
          </section>
        )}

        {/* STORAGE ADVISOR */}
        {view === "storage" && (
          <section className="card">
            <BackToHome />
            <h2>Storage Advisor 🧊</h2>
            <p className="muted small">
              Ask where to store something (e.g., meat, sugar, rice, milk).
            </p>
            <div className="form">
              <div className="form-row">
                <input
                  type="text"
                  placeholder="What food item?"
                  value={storageQuery}
                  onChange={(e) => setStorageQuery(e.target.value)}
                />
              </div>
            </div>
            {storageQuery && (
              <p className="small">
                {getStorageAdvice(storageQuery)}
              </p>
            )}
          </section>
        )}

        {/* CHATBOT VIEW */}
        {view === "chatbot" && (
          <section className="card">
            <BackToHome />
            <h2>Kitchen Chatbot 💬</h2>
            <p className="muted small">
              Ask simple questions about recipes, compost, storage, or waste.
            </p>
            <div className="chatbox">
              <div className="chat-log">
                {chatMessages.length === 0 && (
                  <p className="muted small">
                    Try asking: &quot;How should I store rice?&quot; or
                    &quot;How do I reduce waste?&quot;
                  </p>
                )}
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className="chat-pair">
                    <div className="chat-bubble user">
                      You: {msg.user}
                    </div>
                    <div className="chat-bubble bot">
                      Bot: {msg.bot}
                    </div>
                  </div>
                ))}
              </div>
              <div className="chat-input-row">
                <input
                  type="text"
                  placeholder="Type your question..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                />
                <button
                  type="button"
                  className="primary-btn"
                  onClick={handleSendChat}
                >
                  Send
                </button>
              </div>
            </div>
          </section>
        )}

        {/* FAMILY MANAGER LOGIN VIEW */}
        {view === "login" && (
          <section className="card login-card">
            <BackToHome />
            <h2>Family Manager Login 👤</h2>
            <p className="muted small">
              Demo flow: enter phone & household code, tap Send OTP, then use{" "}
              <strong>123456</strong> as the OTP.
            </p>

            {!isManagerLoggedIn && (
              <>
                <form className="form" onSubmit={sendOtpDemo}>
                  <div className="form-row">
                    <input
                      type="tel"
                      placeholder="Mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="form-row">
                    <input
                      type="text"
                      placeholder="Household code"
                      value={householdCode}
                      onChange={(e) => setHouseholdCode(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="primary-btn">
                    Send OTP
                  </button>
                </form>

                {otpSent && (
                  <form className="form" onSubmit={verifyOtpDemo}>
                    <div className="form-row">
                      <input
                        type="text"
                        placeholder="Enter OTP (123456 in demo)"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="primary-btn">
                      Verify & Login
                    </button>
                  </form>
                )}
              </>
            )}

            {isManagerLoggedIn && (
              <>
                <hr className="divider" />
                <h3>Admin / Data Controls</h3>
                <p className="muted small">
                  Inventory items: <strong>{items.length}</strong> • Waste
                  entries: <strong>{wasteEntries.length}</strong> • Shopping
                  items: <strong>{shoppingList.length}</strong>
                </p>

                <div className="admin-grid">
                  <button
                    type="button"
                    className="big-btn"
                    onClick={handleDownloadData}
                  >
                    Export Inventory & Waste (JSON)
                  </button>
                  <button
                    type="button"
                    className="big-btn"
                    onClick={() =>
                      alert(
                        "In a full build, this would manage household members & permissions."
                      )
                    }
                  >
                    Manage Members & Permissions (demo)
                  </button>
                </div>

                <div className="data-controls">
                  <button
                    type="button"
                    className="big-btn"
                    onClick={handleDownloadData}
                  >
                    Download My Data
                  </button>
                  <button
                    type="button"
                    className="danger-btn"
                    onClick={handleDeleteData}
                  >
                    Delete All My Data
                  </button>
                </div>

                <button
                  type="button"
                  className="ghost-btn small-btn"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </>
            )}

            {loginMessage && (
              <p className="muted small" style={{ marginTop: 8 }}>
                {loginMessage}
              </p>
            )}
          </section>
        )}

        {/* BARCODE MODAL (camera preview) */}
        {showBarcodeDemo && (
          <div className="barcode-modal">
            <div className="barcode-card">
              <h3>Barcode Scanner (Demo)</h3>
              <p className="muted small">
                Camera preview only. In a full build we would decode barcodes
                and auto-fill the item name.
              </p>
              <video ref={videoRef} className="barcode-video" />
              <button
                type="button"
                className="ghost-btn"
                onClick={() => setShowBarcodeDemo(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
