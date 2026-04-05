import numpy as np
from datetime import datetime
from sklearn.ensemble import RandomForestRegressor
import pandas as pd
import joblib
import os
from ai_engine.ai_client import ai_client

# Mock trained model path
MODEL_PATH = "backend/ai_engine/risk_model.pkl"

class ExpiryRiskModel:
    def __init__(self):
        self.model = None
        self._load_or_train_model()

    def _load_or_train_model(self):
        if os.path.exists(MODEL_PATH):
            try:
                self.model = joblib.load(MODEL_PATH)
            except:
                self._train_dummy_model()
        else:
            self._train_dummy_model()

    def _train_dummy_model(self):
        """
        Trains a quick lightweight Random Forest on synthetic data 
        to demonstrate the ML capability.
        """
        # Synthetic Data: [days_remaining, storage_condition_score, perishability_score]
        # Target: Risk Score (0-100)
        X = np.array([
            [10, 1, 1], [2, 1, 1], [1, 1, 1], # Low risk items
            [5, 5, 5], [2, 5, 5], [0, 5, 5], # High risk items
            [3, 3, 3], [7, 3, 3], [1, 9, 9], # Mixed
        ])
        y = np.array([10, 50, 60, 40, 80, 100, 30, 20, 95])
        
        self.model = RandomForestRegressor(n_estimators=10, random_state=42)
        self.model.fit(X, y)
        # In a real app, save it. For MVP, we just keep it in memory or could save.
        # joblib.dump(self.model, MODEL_PATH)

    def estimate_shelf_life(self, item_name: str, category: str) -> int:
        """
        Estimates shelf life in days based on specific item names or category rules if expiry is missing.
        """
        name_lower = item_name.lower()
        if "milk" in name_lower: return 6
        if "cheese" in name_lower: return 21
        if "yogurt" in name_lower: return 10
        if "spinach" in name_lower or "lettuce" in name_lower: return 5
        if "potato" in name_lower or "onion" in name_lower: return 30
        if "bread" in name_lower: return 5

        data = {
            "Produce": 7,
            "Dairy": 10,
            "Meat": 5,
            "Fish": 2,
            "Pantry": 180,
            "Leftovers": 3,
            "Grains": 365,
        }
        return data.get(category, 7)

    def get_storage_advice(self, item_name: str, category: str) -> str:
        """
        Provides intelligent storage advice using Gemini AI to extend shelf life.
        """
        prompt = f"Give me a single short sentence of highly practical advice on how to optimally store '{item_name}' (Category: {category}) to maximize shelf life and prevent food waste. Do not use quotes."
        ai_response = gemini_client.generate_content(prompt)
        if ai_response:
            return ai_response.strip()
            
        # Fallback mechanism
        item_name = item_name.lower()
        
        # Specific item rules
        if "tomato" in item_name:
            return "Keep tomatoes at room temperature; refrigeration kills their flavor and prevents ripening."
        if "potato" in item_name:
            return "Store in a cool, dark, well-ventilated place away from onions to prevent sprouting."
        if "banana" in item_name:
            return "Store away from other fruits. Wrap stems in plastic to slow down ripening."
        if "onion" in item_name:
            return "Keep in a cool, dry, dark place. Do not store near potatoes as they accelerate spoilage."
        if "milk" in item_name:
            return "Store on the main shelf, not the door, where temperature is most stable."
        if "bread" in item_name:
            return "Freeze if not consuming within 2-3 days. Avoid the fridge as it makes bread go stale faster."
            
        # Category fallback rules
        category_tips = {
            "Produce": "Avoid washing before storing; moisture promotes mold growth.",
            "Dairy": "Keep in the back of the fridge where it's coldest.",
            "Meat": "Store on the bottom shelf to prevent juices from dripping onto other foods.",
            "Fish": "Best used on the day of purchase. If storing, keep on ice in the coldest part of the fridge.",
            "Pantry": "Transfer to airtight containers to keep out moisture and pests.",
            "Leftovers": "Cool quickly and store in airtight containers. Best used within 3-4 days.",
        }
        
        return category_tips.get(category, "Keep in its original packaging or an airtight container.")

    def predict_risk(self, days_remaining: int, storage_type: str, item_category: str) -> tuple:
        """
        Predicts risk score and provides Explainable AI details.
        (Roadmap Feature 2)
        """
        # Feature Engineering
        storage_score = 1
        if "fridge" in storage_type.lower(): storage_score = 3
        if "pantry" in storage_type.lower(): storage_score = 5
        
        perishability_score = 1
        if item_category in ["Dairy", "Meat", "Fish"]: perishability_score = 9
        if item_category in ["Produce"]: perishability_score = 7
        
        features = np.array([[days_remaining, storage_score, perishability_score]])
        
        try:
            score = self.model.predict(features)[0]
            if days_remaining <= 0: score = 100
            score = int(max(0, min(100, score)))
            
            # Explainable AI Logic
            reasons = []
            if days_remaining <= 2: reasons.append(f"Only {days_remaining} days left")
            if perishability_score >= 7: reasons.append(f"Highly perishable {item_category}")
            if storage_type == "pantry" and perishability_score > 3: 
                reasons.append("Non-refrigerated storage for sensitive item")
                
            explanation = " + ".join(reasons) if reasons else "Stable storage"
            
            return score, explanation
        except:
            return 50, "Standard risk assessment"

# Singleton instance
risk_model = ExpiryRiskModel()
