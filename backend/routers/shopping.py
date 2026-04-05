from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import models, schemas, database

router = APIRouter(
    prefix="/shopping",
    tags=["shopping"]
)

@router.get("", response_model=List[schemas.ShoppingItemResponse])
def get_shopping_list(db: Session = Depends(database.get_db)):
    # For MVP, just get items from the first found list or create one
    s_list = db.query(models.ShoppingList).first()
    if not s_list:
        s_list = models.ShoppingList(name="Weekly Grocery")
        db.add(s_list)
        db.commit()
        db.refresh(s_list)
    return s_list.items

@router.post("/add", response_model=schemas.ShoppingItemResponse)
def add_item(item: schemas.ShoppingItemCreate, db: Session = Depends(database.get_db)):
    s_list = db.query(models.ShoppingList).first()
    if not s_list:
        s_list = models.ShoppingList(name="Weekly Grocery")
        db.add(s_list)
        db.commit()
        db.refresh(s_list)
        
    db_item = models.ShoppingListItem(**item.dict(), list_id=s_list.id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.post("/generate_smart")
def generate_smart_list(db: Session = Depends(database.get_db)):
    """
    AI Logic: Checks inventory for staples that are low/missing and auto-adds them.
    """
    staples = ["Milk", "Bread", "Eggs", "Rice", "Onions"]
    inventory_names = [i.name.lower() for i in db.query(models.Item).all()]
    
    added = []
    s_list = db.query(models.ShoppingList).first()
    if not s_list:
        s_list = models.ShoppingList()
        db.add(s_list)
        db.commit()

    existing_list_items = [i.name.lower() for i in s_list.items] if s_list.items else []
    
    for staple in staples:
        # Check if it's NOT in inventory AND NOT already in the shopping list
        if not any(staple.lower() in name for name in inventory_names) and not any(staple.lower() in name for name in existing_list_items):
            new_item = models.ShoppingListItem(
                name=staple, 
                quantity="1 unit", 
                category="Staple",
                list_id=s_list.id
            )
            db.add(new_item)
            added.append(staple)
            
    db.commit()
    return {"message": "Smart list generated", "added_items": added}
