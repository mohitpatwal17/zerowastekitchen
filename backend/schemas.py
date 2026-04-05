from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

# --- Item Schemas ---
class ItemBase(BaseModel):
    name: str
    quantity: str
    category: str
    expiry_date: Optional[datetime] = None
    storage_type: str = "fridge"
    storage_location: str = "Main Shelf"
    is_leftover: bool = False
    bought_at: Optional[datetime] = None
    price: float = 0.0
    estimated_consumption_days: int = 7

class ItemCreate(ItemBase):
    pass

class ItemResponse(ItemBase):
    id: int
    risk_score: int
    risk_status: str
    risk_explanation: str
    created_at: datetime
    is_used: bool

    class Config:
        from_attributes = True

# --- Shopping List Schemas ---
class ShoppingItemCreate(BaseModel):
    name: str
    quantity: str = "1"
    category: str = "General"

class ShoppingItemResponse(ShoppingItemCreate):
    id: int
    is_purchased: bool
    class Config:
        from_attributes = True

# --- Waste Log Schemas ---
class WasteLogCreate(BaseModel):
    item_name: str
    reason: str
    quantity_wasted: float
    cost_lost: float = 0.0

class WasteLogResponse(WasteLogCreate):
    id: int
    log_date: datetime
    class Config:
        from_attributes = True

# --- Planner Schemas ---
class PlannerRequest(BaseModel):
    preferences: Optional[str] = None
    dietary_preference: Optional[str] = "both" # veg, non-veg, both
    cuisine: Optional[str] = None # North Indian, South Indian, Hyderabadi, etc.
    max_time_minutes: Optional[int] = 30

class RecipeSuggestion(BaseModel):
    title: str
    ingredients: List[str]
    time_minutes: int
    co2_saved: float
    image_url: Optional[str] = None
    rescuing_items: List[str]
    is_veg: bool = True
    instructions: List[str] = []
    waste_explanation: str = ""

# --- Portion Planner Schemas ---
class PortionRequest(BaseModel):
    dish_name: str
    num_people: int

class IngredientCheck(BaseModel):
    name: str
    required: str
    available: str
    status: str # "Enough", "Missing", "Excess"

class PortionResponse(BaseModel):
    dish_name: str
    num_people: int
    checks: List[IngredientCheck]
    suggestion: str
    instructions: List[str] = []

# --- Insight Schemas ---
class InsightResponse(BaseModel):
    title: str
    message: str
    type: str # success, tip, warning

# --- AI Proxy Schemas ---
class AIProxyRequest(BaseModel):
    prompt: str
    system_instruction: Optional[str] = None

class AIProxyResponse(BaseModel):
    response: str
