from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import models, database

router = APIRouter(
    prefix="/analytics",
    tags=["analytics"]
)

from sqlalchemy import func

@router.get("/impact")
def get_impact_stats(db: Session = Depends(database.get_db)):
    # Calculate total waste logged
    total_waste_kg = db.query(func.sum(models.WasteLog.quantity_wasted)).scalar() or 0.0
    total_financial_loss = db.query(func.sum(models.WasteLog.cost_lost)).scalar() or 0.0
    
    # Mock savings based on hypothetical "baseline" vs actual
    # Assuming user reduces waste by 20% compared to a standard baseline (e.g. 1.25x current waste)
    potential_waste = total_waste_kg * 1.25
    saved_kg = potential_waste - total_waste_kg
    
    # CO2 saved (approx 2.5kg CO2 per kg of food waste avoided)
    co2_saved = saved_kg * 2.5 
    
    # Financial savings (approx same ratio)
    financial_saved = total_financial_loss * 0.25 

    # Predict future waste (Tier 3 - Feature 7)
    high_risk_items = db.query(models.Item).filter(models.Item.risk_score > 70).all()
    # Assume 80% of high risk items will be wasted if no action taken
    predicted_waste_kg = sum([0.5 for _ in high_risk_items]) * 0.8 # approx 0.5kg per item
    predicted_loss = sum([item.price for item in high_risk_items]) * 0.8

    return {
        "co2_saved_kg": round(co2_saved, 1),
        "water_saved_liters": round(saved_kg * 800, 1),
        "energy_saved_kwh": round(saved_kg * 12.5, 1),
        "financial_savings_usd": round(financial_saved, 2),
        "trees_planted_equiv": round(co2_saved / 20, 2),
        "predicted_waste_next_week_kg": round(predicted_waste_kg, 1),
        "potential_savings_opportunity": round(predicted_loss, 2),
        "monthly_trend": [
            # For MVP, still returning placeholder trend but could be aggregated by month
            {"month": "Jan", "saved": 20},
            {"month": "Feb", "saved": 45},
            {"month": "Mar", "saved": 30},
            {"month": "Apr", "saved": 60},
            {"month": "May", "saved": 85},
        ]
    }
