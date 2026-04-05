from ai_engine.ai_client import ai_client

class LeftoverIntelligence:
    def suggest_usage(self, leftover_item: str) -> str:
        """
        Suggests how to use a specific leftover item using Gemini AI (with a fallback).
        """
        prompt = f"Give me a single, creative, short sentence appetizing suggestion on how to use leftover '{leftover_item}' in a new meal to prevent food waste. Do not use quotes."
        ai_response = ai_client.generate_content(prompt)
        if ai_response:
            return ai_response.strip()
            
        # Fallback mechanism
        item = leftover_item.lower()
        
        if "rice" in item:
            return "Make Fried Rice with veggies."
        elif "pasta" in item:
            return "Turn into a Pasta Frittata."
        elif "chicken" in item:
            return "Shred for Tacos, Salad, or a Sandwich."
        elif "vegetables" in item or "spinach" in item or "carrot" in item:
            return "Blend into a Soup, Stock, or use in a Frittata."
        elif "bread" in item or "toast" in item:
            return "Make Croutons, Bread Pudding, or French Toast."
        elif "milk" in item or "cream" in item:
            return "Use in Pancakes, Creamy Pasta Sauce, or Smoothies."
        elif "cheese" in item:
            return "Melt into a Mac & Cheese or sprinkle on roasted veggies."
        elif "fruit" in item or "apple" in item or "banana" in item:
            return "Freeze for Smoothies or bake into Muffins."
        elif "egg" in item:
            return "Make a Quiche, Omelet, or Egg Salad."
        elif "meat" in item or "beef" in item or "pork" in item:
            return "Use in a Stir Fry, Curry, or Stew."
        else:
            return "Incorporate into a nourish bowl, wrap, or soup."

leftover_brain = LeftoverIntelligence()
