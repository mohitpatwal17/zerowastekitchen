from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas, database, ai_engine
from datetime import datetime

router = APIRouter(
    prefix="/items",
    tags=["inventory"]
)

@router.get("/storage-tips")
def get_storage_tips(name: str, category: str):
    advice = ai_engine.get_storage_advice(name, category)
    return {"advice": advice}

@router.post("", response_model=schemas.ItemResponse)
def create_item(item: schemas.ItemCreate, db: Session = Depends(database.get_db)):
    # 1. Smart Expiry Estimation (Feature 1)
    expiry_date = item.expiry_date
    if not expiry_date:
        days = ai_engine.get_shelf_life_estimation(item.category)
        from datetime import timedelta
        expiry_date = datetime.now() + timedelta(days=days)
    
    # 2. Risk Scoring with Explanation (Feature 2)
    risk_score, explanation = ai_engine.calculate_risk_score(item.name, expiry_date, item.storage_type, item.category)
    risk_status = ai_engine.get_risk_status(risk_score)
    
    # Use provided bought_at or default to now
    bought_at = item.bought_at or datetime.now()

    db_item = models.Item(
        **item.dict(exclude={"expiry_date", "bought_at"}),
        expiry_date=expiry_date,
        bought_at=bought_at,
        risk_score=risk_score,
        risk_status=risk_status,
        risk_explanation=explanation
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.get("", response_model=List[schemas.ItemResponse])
def read_items(db: Session = Depends(database.get_db), skip: int = 0, limit: int = 100):
    items = db.query(models.Item).order_by(models.Item.risk_score.desc()).offset(skip).limit(limit).all()
    
    for i in items:
        new_score, new_explanation = ai_engine.calculate_risk_score(i.name, i.expiry_date, i.storage_type, i.category)
        if new_score != i.risk_score or new_explanation != i.risk_explanation:
            i.risk_score = new_score
            i.risk_explanation = new_explanation
            i.risk_status = ai_engine.get_risk_status(new_score)
            db.add(i)
    db.commit()
    
    return items

@router.delete("/{item_id}")
def delete_item(item_id: int, db: Session = Depends(database.get_db)):
    db_item = db.query(models.Item).filter(models.Item.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(db_item)
    db.commit()
    return {"ok": True}
