from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import models, schemas, database, ai_engine

router = APIRouter(
    prefix="/insights",
    tags=["insights"]
)

@router.get("/behavioral", response_model=List[schemas.InsightResponse])
def get_behavioral_insights(db: Session = Depends(database.get_db)):
    """
    Generates AI behavioral feedback based on inventory and waste habits.
    (Roadmap Feature 10)
    """
    insights = []
    
    # Check for recent waste reduction (logic simplified for MVP)
    waste_logs = db.query(models.WasteLog).all()
    if len(waste_logs) < 2:
        insights.append({
            "title": "Welcome, Eco-Warrior!",
            "message": "Start logging your kitchen activity to see AI behavioral tips.",
            "type": "tip"
        })
    else:
        # Example Logic: Dairy Hero
        dairy_waste = db.query(models.WasteLog).filter(models.WasteLog.item_name.ilike("%milk%")).count()
        if dairy_waste == 0:
            insights.append({
                "title": "Dairy Hero! 🥛",
                "message": "You haven't wasted any milk this week. Your planning is spot on!",
                "type": "success"
            })
            
    # Check for prep efficiency
    high_risk_produce = db.query(models.Item).filter(
        models.Item.category == "Produce", 
        models.Item.risk_score > 70
    ).count()
    
    if high_risk_produce > 2:
        insights.append({
            "title": "Prep Efficiency Tip 💡",
            "message": "Your vegetables are reaching high risk. Try batch-prepping them today to extend shelf life.",
            "type": "tip"
        })
    else:
        insights.append({
            "title": "Meal Planner Master 🍳",
            "message": "You're doing great using the meal planner to stay ahead of expiry risks!",
            "type": "success"
        })

    return insights
