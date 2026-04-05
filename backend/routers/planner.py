from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import models, schemas, database
import random

router = APIRouter(
    prefix="/planner",
    tags=["planner"]
)

@router.get("/suggestions", response_model=List[schemas.RecipeSuggestion])
def get_default_suggestions(db: Session = Depends(database.get_db)):
    """
    Default GET endpoint for the frontend planner page.
    """
    # Create a default request
    default_request = schemas.PlannerRequest(dietary_preference="both", max_time_minutes=30)
    return format_plan(default_request, db)

@router.post("/consult", response_model=List[schemas.RecipeSuggestion])
def format_plan(request: schemas.PlannerRequest, db: Session = Depends(database.get_db)):
    # 1. Get high risk items
    high_risk_items = db.query(models.Item).filter(models.Item.risk_score > 50).all()
    if not high_risk_items:
        high_risk_items = db.query(models.Item).all()

    ingredient_names = [item.name for item in high_risk_items]
    
    # 2. Use MealRecommender with preferences
    from ai_engine import meal_recommender
    raw_suggestions = meal_recommender.suggest_meals(
        ingredient_names, 
        preference=request.dietary_preference, 
        cuisine=request.cuisine,
        max_time=request.max_time_minutes
    )

    suggestions = []
    for s in raw_suggestions:
        # Map raw suggestions to RecipeSuggestion schema
        img = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=60" 
        if "salad" in s["title"].lower(): img = "https://images.unsplash.com/photo-1512621776951-a57141f2eefd"
        elif "pasta" in s["title"].lower(): img = "https://images.unsplash.com/photo-1556761223-4c4282c73f77"
        elif "omelet" in s["title"].lower(): img = "https://images.unsplash.com/photo-1510629954389-c1e0da47d415"
        elif "curry" in s["title"].lower(): img = "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db"
        elif "paneer" in s["title"].lower(): img = "https://images.unsplash.com/photo-1631452180519-c014fe946bc7"

        suggestions.append(schemas.RecipeSuggestion(
            title=s["title"],
            ingredients=s["used_ingredients"],
            time_minutes=s["time_minutes"],
            co2_saved=round(len(s["used_ingredients"]) * 0.5, 1),
            image_url=img,
            rescuing_items=s["used_ingredients"],
            is_veg=s["is_veg"],
            instructions=s["instructions"],
            waste_explanation=s["waste_explanation"]
        ))
    
    # Fallback if no matches
    if not suggestions:
        return [
            schemas.RecipeSuggestion(
                title="Kitchen Restock Salad",
                ingredients=["Greens", "Tomato", "Cucumber"],
                time_minutes=10,
                co2_saved=0.0,
                rescuing_items=[],
                is_veg=True,
                instructions=["Wash greens", "Chop vegetables", "Mix in a bowl"],
                waste_explanation="A simple salad to use up any remaining vegetables."
            )
        ]
            
    return suggestions[:5]

@router.post("/portion-check", response_model=schemas.PortionResponse)
def portion_check(request: schemas.PortionRequest, db: Session = Depends(database.get_db)):
    # 1. Get current inventory
    items = db.query(models.Item).all()
    inventory_list = [{"name": i.name, "quantity": i.quantity} for i in items]
    
    # 2. Use AI Engine
    from ai_engine import get_portion_calculation
    result = get_portion_calculation(request.dish_name, request.num_people, inventory_list)
    
    if not result:
        return schemas.PortionResponse(
            dish_name=request.dish_name,
            num_people=request.num_people,
            checks=[],
            suggestion="Dish not found in our AI database. Try 'Paneer Butter Masala' or 'Chicken Curry'."
        )
    
    return result

