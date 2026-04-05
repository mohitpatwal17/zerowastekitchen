from typing import List, Dict, Optional

class MealRecommender:
    def __init__(self):
        # Mock Knowledge Graph of Recipes and Ingredients
        self.recipes = [
            {
                "title": "Spinach & Feta Omelet", 
                "ingredients": ["eggs", "spinach", "feta", "onion"], 
                "is_veg": True,
                "type": "breakfast",
                "time": 10,
                "instructions": ["Whisk eggs", "Sauté spinach and onion", "Fold in feta and cook omelet"],
                "base_portions": {"eggs": "2 units", "spinach": "50g", "feta": "30g", "onion": "0.5 unit"}
            },
            {
                "title": "Creamy Mushroom Pasta", 
                "ingredients": ["pasta", "mushrooms", "cream", "garlic"], 
                "is_veg": True,
                "type": "dinner",
                "time": 20,
                "instructions": ["Boil pasta", "Sauté mushrooms and garlic", "Add cream and mix with pasta"],
                "base_portions": {"pasta": "100g", "mushrooms": "150g", "cream": "100ml", "garlic": "2 cloves"}
            },
            {
                "title": "Chicken Curry", 
                "ingredients": ["chicken", "onion", "tomato", "curry powder"], 
                "is_veg": False,
                "type": "dinner",
                "time": 40,
                "instructions": ["Sauté onion and tomato", "Add chicken and spices", "Simmer until cooked"],
                "base_portions": {"chicken": "200g", "onion": "1 unit", "tomato": "1 unit", "curry powder": "2 tbsp"}
            },
            {
                "title": "Paneer Butter Masala", 
                "ingredients": ["paneer", "butter", "tomato", "cream"], 
                "is_veg": True,
                "type": "dinner",
                "time": 30,
                "instructions": ["Sauté tomato and ginger", "Blend into paste", "Add butter, cream, and paneer cubes"],
                "base_portions": {"paneer": "150g", "butter": "20g", "tomato": "2 units", "cream": "50ml"}
            },
            {
                "title": "Avocado Toast", 
                "ingredients": ["bread", "avocado", "lemon", "chili flakes"], 
                "is_veg": True,
                "type": "breakfast",
                "time": 5,
                "instructions": ["Toast bread", "Mash avocado with lemon", "Spread on toast and top with chili flakes"],
                "base_portions": {"bread": "2 slices", "avocado": "1 unit", "lemon": "0.5 unit", "chili flakes": "1 tsp"}
            },
            {
                "title": "Vegetable Biryani", 
                "ingredients": ["rice", "carrot", "peas", "biryani masala"], 
                "is_veg": True,
                "type": "dinner",
                "cuisine": "Hyderabadi",
                "time": 45,
                "instructions": ["Soak rice", "Sauté vegetables with masala", "Cook rice with veggies", "Garnish with coriander"],
                "base_portions": {"rice": "100g", "carrot": "1 unit", "peas": "50g", "biryani masala": "1 tbsp"}
            },
            {
                "title": "Aloo Gobhi", 
                "ingredients": ["potato", "cauliflower", "onion", "turmeric"], 
                "is_veg": True,
                "type": "dinner",
                "cuisine": "North Indian",
                "time": 25,
                "instructions": ["Sauté onions", "Add potatoes and cauliflower", "Season with turmeric and cook until tender"],
                "base_portions": {"potato": "2 units", "cauliflower": "1 unit", "onion": "1 unit", "turmeric": "1 tsp"}
            },
            {
                "title": "Dal Tadka", 
                "ingredients": ["lentils", "garlic", "cumin", "tomato"], 
                "is_veg": True,
                "type": "dinner",
                "cuisine": "North Indian",
                "time": 30,
                "instructions": ["Pressure cook lentils", "Sauté garlic and cumin in ghee", "Add tomatoes and tempered spices to dal"],
                "base_portions": {"lentils": "1 cup", "garlic": "4 cloves", "cumin": "1 tsp", "tomato": "1 unit"}
            },
            {
                "title": "Baingan Bharta", 
                "ingredients": ["eggplant", "onion", "tomato", "green chili"], 
                "is_veg": True,
                "type": "dinner",
                "cuisine": "North Indian",
                "time": 35,
                "instructions": ["Roast eggplant", "Mash and sauté with onions, tomatoes and chilies"],
                "base_portions": {"eggplant": "1 big", "onion": "2 units", "tomato": "1 unit", "green chili": "2 units"}
            },
            {
                "title": "Sambar", 
                "ingredients": ["lentils", "drumstick", "tamarind", "sambar powder"], 
                "is_veg": True,
                "type": "dinner",
                "cuisine": "South Indian",
                "time": 30,
                "instructions": ["Boil lentils", "Cook veggies in tamarind water", "Mix with lentils and sambar powder"],
                "base_portions": {"lentils": "1 cup", "drumstick": "2 units", "tamarind": "30g", "sambar powder": "2 tbsp"}
            },
        ]

    def suggest_meals(self, high_risk_ingredients: List[str], preference: str = "both", max_time: int = 60, cuisine: Optional[str] = None) -> List[Dict]:
        """
        Returns recipes that use the most high-risk ingredients.
        Now powered by Google Gemini AI!
        """
        from ai_engine.ai_client import ai_client
        import json
        
        ingredients_str = ", ".join(high_risk_ingredients) if high_risk_ingredients else "pantry staples"
        prompt = f'''
        Generate 3 distinct recipe ideas that specifically use THESE ingredients: {ingredients_str}.
        Dietary Preference: {preference} (if 'veg', MUST be strict vegetarian).
        Max Cooking Time: {max_time} minutes.
        Cuisine Style: {cuisine if cuisine else "Any"}.
        
        Return ONLY a raw JSON array of objects. Do not wrap in markdown or backticks. Each object must have these exact keys:
        - "title": (string) name of recipe
        - "used_ingredients": (array of strings) ingredients used from the provided list
        - "relevance_score": (float between 0.8 and 1.0)
        - "missing_ingredients_count": (int) number of additional ingredients needed
        - "time_minutes": (int) total cooking time
        - "is_veg": (boolean)
        - "instructions": (array of strings) short step-by-step instructions
        - "waste_explanation": (string) A short encouraging sentence explaining why this recipe prevents waste based on the ingredients used.
        '''
        
        ai_response = ai_client.generate_content(prompt)
        if ai_response:
            try:
                text = ai_response.strip()
                if text.startswith('```json'): text = text.split('```json', 1)[1]
                if text.startswith('```'): text = text.split('```', 1)[1]
                if text.endswith('```'): text = text.rsplit('```', 1)[0]
                
                recipes = json.loads(text.strip())
                if isinstance(recipes, list) and len(recipes) > 0:
                    return recipes
            except Exception as e:
                print(f"Failed to parse Gemini recipe JSON: {e}")
                
        # Fallback to mock local logic
        suggestions = []
        
        for recipe in self.recipes:
            # Preference filter
            if preference == "veg" and not recipe["is_veg"]: continue
            if preference == "non-veg" and recipe["is_veg"]: continue
            
            # Cuisine filter (Tier 2 - Feature 5)
            if cuisine and recipe.get("cuisine") != cuisine: continue
            
            # Time filter
            if recipe.get("time", 60) > max_time: continue

            matches = 0
            matched_items = []
            recipe_ingredients = recipe["ingredients"]
            
            for risk_item in high_risk_ingredients:
                if any(risk_item.lower() in ri or ri in risk_item.lower() for ri in recipe_ingredients):
                    matches += 1
                    matched_items.append(risk_item)
            
            if matches > 0:
                score = matches / len(recipe_ingredients)
                suggestions.append({
                    "title": recipe["title"],
                    "used_ingredients": matched_items,
                    "relevance_score": score,
                    "missing_ingredients_count": len(recipe_ingredients) - matches,
                    "time_minutes": recipe["time"],
                    "is_veg": recipe["is_veg"],
                    "instructions": recipe["instructions"],
                    "waste_explanation": f"This recipe uses {', '.join(matched_items)} which are near expiry!"
                })
        
        suggestions.sort(key=lambda x: x["relevance_score"], reverse=True)
        return suggestions

    def get_portion_check(self, dish_name: str, num_people: int, inventory_items: List[Dict]) -> Dict:
        """
        Calculates ingredient requirements for a dish and compares with inventory.
        """
        recipe = next((r for r in self.recipes if r["title"].lower() == dish_name.lower()), None)
        if not recipe:
            return None
        
        checks = []
        for ing, base_qty in recipe["base_portions"].items():
            # Basic parsing of quantity (e.g., "200g" -> 200)
            # This is a simplification for the MVP
            import re
            match = re.search(r"(\d+\.?\d*)", base_qty)
            unit = re.sub(r"(\d+\.?\d*)", "", base_qty).strip()
            val = float(match.group(1)) if match else 1.0
            
            required_val = val * num_people
            required_str = f"{required_val}{unit}"
            
            # Find in inventory
            inv_item = next((i for i in inventory_items if ing in i["name"].lower()), None)
            available_str = inv_item["quantity"] if inv_item else "0"
            
            # Simplified status check
            status = "Enough"
            if not inv_item:
                status = "Missing"
            else:
                # Try to compare quantities (very basic)
                inv_match = re.search(r"(\d+\.?\d*)", available_str)
                inv_val = float(inv_match.group(1)) if inv_match else 0.0
                if inv_val < required_val:
                    status = "Missing"
                elif inv_val > required_val * 1.5:
                    status = "Excess"
            
            checks.append({
                "name": ing,
                "required": required_str,
                "available": available_str,
                "status": status
            })
            
        suggestion = f"For {num_people} people, you need {recipe['title']} ingredients scaled. "
        if any(c["status"] == "Missing" for c in checks):
            suggestion += "You are missing some items. Consider adjusting the portion or buying more."
        elif any(c["status"] == "Excess" for c in checks):
            suggestion += "You have excess of some ingredients – maybe cook for one more person?"
        else:
            suggestion += "You have just enough! Perfect for zero waste."

        return {
            "dish_name": recipe["title"],
            "num_people": num_people,
            "checks": checks,
            "suggestion": suggestion,
            "instructions": recipe["instructions"]
        }

meal_recommender = MealRecommender()

