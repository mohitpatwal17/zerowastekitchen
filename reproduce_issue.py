import requests
import json

url = "http://localhost:8000/waste/log"
payload = {
    "item_name": "Test Apple",
    "reason": "Expired",
    "quantity_wasted": 0.5,
    "cost_lost": 1.5
}

try:
    print(f"Sending POST to {url} with payload: {payload}")
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
