from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Enum
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime
import enum

class UserRole(str, enum.Enum):
    HOUSEHOLD = "household"
    RESTAURANT = "restaurant"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    role = Column(String, default="household") # household, restaurant
    
    inventory_items = relationship("Item", back_populates="owner")
    waste_logs = relationship("WasteLog", back_populates="owner")
    shopping_lists = relationship("ShoppingList", back_populates="owner")

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    quantity = Column(String) 
    category = Column(String)
    expiry_date = Column(DateTime)
    storage_type = Column(String, default="fridge") # fridge, freezer, pantry
    storage_location = Column(String, default="Main Shelf") # shelf specific
    bought_at = Column(DateTime, default=datetime.now)
    risk_score = Column(Integer, default=0)
    risk_status = Column(String, default="Low")
    risk_explanation = Column(String, default="")
    is_leftover = Column(Boolean, default=False)
    is_used = Column(Boolean, default=False)
    price = Column(Float, default=0.0) # Feature 4: Budget Aware
    estimated_consumption_days = Column(Integer, default=7) # Feature 6: Habits
    created_at = Column(DateTime, default=datetime.now)
    
    owner_id = Column(Integer, ForeignKey("users.id"), default=1, nullable=True) # Default to User 1
    owner = relationship("User", back_populates="inventory_items")

class WasteLog(Base):
    __tablename__ = "waste_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    item_name = Column(String)
    reason = Column(String) # Expired, Moldy, Taste, Excess Portion
    quantity_wasted = Column(Float) # in kg
    cost_lost = Column(Float, default=0.0)
    log_date = Column(DateTime, default=datetime.now)
    
    owner_id = Column(Integer, ForeignKey("users.id"), default=1, nullable=True)
    owner = relationship("User", back_populates="waste_logs")

class ShoppingList(Base):
    __tablename__ = "shopping_lists"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, default="My Shopping List")
    created_at = Column(DateTime, default=datetime.now)
    
    owner_id = Column(Integer, ForeignKey("users.id"), default=1, nullable=True)
    owner = relationship("User", back_populates="shopping_lists")
    items = relationship("ShoppingListItem", back_populates="list")

class ShoppingListItem(Base):
    __tablename__ = "shopping_list_items"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    quantity = Column(String)
    is_purchased = Column(Boolean, default=False)
    category = Column(String, default="General")
    
    list_id = Column(Integer, ForeignKey("shopping_lists.id"))
    list = relationship("ShoppingList", back_populates="items")
