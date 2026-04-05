import requests
from datetime import datetime, timedelta

def seed():
    url = "http://127.0.0.1:8000/items"
    today = datetime.now()
    
    items = [
        {"name": "Spinach", "quantity": "1 bunch", "category": "Produce", "expiry_date": today.isoformat(), "price": 40},
        {"name": "Tomatoes", "quantity": "500g", "category": "Produce", "expiry_date": today.isoformat(), "price": 60},
        {"name": "Milk", "quantity": "1L", "category": "Dairy", "expiry_date": today.isoformat(), "price": 80},
        {"name": "Eggs", "quantity": "6 pcs", "category": "Dairy", "expiry_date": (today + timedelta(days=4)).isoformat(), "price": 120},
        {"name": "Paneer", "quantity": "200g", "category": "Dairy", "expiry_date": (today + timedelta(days=6)).isoformat(), "price": 250},
        {"name": "Chicken", "quantity": "500g", "category": "Meat", "expiry_date": (today + timedelta(days=2)).isoformat(), "price": 400},
    ]
    
    for item in items:
        try:
            r = requests.post(url, json=item)
            if r.status_code == 200:
                print(f"✅ Added {item['name']}")
            else:
                print(f"❌ Failed to add {item['name']}: {r.status_code} - {r.text}")
        except Exception as e:
            print(f"💥 Error adding {item['name']}: {e}")

if __name__ == "__main__":
    seed()
