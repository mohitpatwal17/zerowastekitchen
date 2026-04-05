from datetime import datetime
from ai_engine.expiry_risk_model import risk_model
from ai_engine.meal_recommender import meal_recommender
from ai_engine.leftover_intelligence import leftover_brain

# Expose the API expected by routers
def calculate_risk_score(item_name: str, expiry_date: datetime, storage_type: str = "fridge", category: str = "Pantry") -> tuple:
    if not expiry_date:
        # If no expiry date provided, we could estimate it here or outside
        # For now, assume it's provided or handled by the router
        return 0, "No expiry date"

    if expiry_date.tzinfo is not None:
        today = datetime.now(expiry_date.tzinfo)
    else:
        today = datetime.now()
        
    days_remaining = (expiry_date - today).days
    
    return risk_model.predict_risk(days_remaining, storage_type, category)

def get_shelf_life_estimation(item_name: str, category: str) -> int:
    return risk_model.estimate_shelf_life(item_name, category)

def get_storage_advice(item_name: str, category: str) -> str:
    return risk_model.get_storage_advice(item_name, category)

def get_risk_status(score: int) -> str:
    if score >= 90: return "Critical"
    elif score >= 70: return "High"
    elif score >= 40: return "Medium"
    else: return "Low"

def get_meal_suggestions(ingredients):
    return meal_recommender.suggest_meals(ingredients)

def get_leftover_idea(item):
    return leftover_brain.suggest_usage(item)

def get_portion_calculation(dish_name, num_people, inventory):
    return meal_recommender.get_portion_check(dish_name, num_people, inventory)

