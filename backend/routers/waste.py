from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import models, schemas, database

router = APIRouter(
    prefix="/waste",
    tags=["waste"]
)

@router.post("/log", response_model=schemas.WasteLogResponse)
def log_waste(log: schemas.WasteLogCreate, db: Session = Depends(database.get_db)):
    db_log = models.WasteLog(**log.dict())
    
    # Find and delete corresponding inventory item (case-insensitive)
    inventory_item = db.query(models.Item).filter(
        models.Item.name.ilike(log.item_name)
    ).first()
    
    if inventory_item:
        db.delete(inventory_item)
    
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

@router.get("", response_model=List[schemas.WasteLogResponse])
def get_waste_logs(db: Session = Depends(database.get_db)):
    return db.query(models.WasteLog).order_by(models.WasteLog.log_date.desc()).all()

