export const FOOD_EMOJIS: Record<string, string> = {
  "Produce": "🥦",
  "Vegetables": "🥕",
  "Fruits": "🍎",
  "Dairy": "🥛",
  "Meat": "🥩",
  "Poultry": "🍗",
  "Seafood": "🐟",
  "Bakery": "🍞",
  "Grains": "🌾",
  "Pantry": "🥫",
  "Snacks": "🥨",
  "Beverages": "🧃",
  "Frozen": "🧊",
  "Leftovers": "🍱",
  "Staple": "🏠",
  "General": "📦",
};

export const getFoodEmoji = (category: string | undefined): string => {
  if (!category) return "🍱";
  return FOOD_EMOJIS[category] || FOOD_EMOJIS["General"];
};
