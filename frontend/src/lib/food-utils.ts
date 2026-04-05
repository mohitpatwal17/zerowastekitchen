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

export const getFoodEmoji = (category: string | undefined, name: string = ""): string => {
  const n = name.toLowerCase();
  
  if (n.includes('potato') || n.includes('onion')) return '🧅';
  if (n.includes('tomato')) return '🍅';
  if (n.includes('spinach') || n.includes('spanish') || n.includes('lettuce')) return '🥬';
  if (n.includes('chicken') || n.includes('hen')) return '🍗';
  if (n.includes('egg')) return '🥚';
  if (n.includes('bread')) return '🍞';
  if (n.includes('milk')) return '🥛';
  if (n.includes('cheese')) return '🧀';
  if (n.includes('carrot')) return '🥕';
  if (n.includes('apple')) return '🍎';
  if (n.includes('banana')) return '🍌';
  if (n.includes('rice')) return '🍚';
  if (n.includes('bean')) return '🫘';
  if (n.includes('garlic')) return '🧄';

  if (!category) {
      if (name) return name.charAt(0).toUpperCase();
      return "🍱";
  }
  return FOOD_EMOJIS[category] || (name ? name.charAt(0).toUpperCase() : "📦");
};
