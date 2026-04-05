import requests
import json
from datetime import datetime

url = "http://127.0.0.1:8000/items/"
data = {
    "name": "Test Milk",
    "quantity": "1L",
    "category": "Dairy",
    "expiry_date": datetime.now().isoformat(),
    "storage_type": "fridge",
    "storage_location": "Door",
    "is_leftover": False,
    "bought_at": datetime.now().isoformat()
}

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.text}")
except Exception as e:
    print(f"Error: {e}")
