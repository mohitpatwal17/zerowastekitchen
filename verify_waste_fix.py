import requests
import json
from datetime import datetime, timedelta

BASE_URL = "http://localhost:8000"

def create_item(name):
    print(f"Creating item: {name}")
    url = f"{BASE_URL}/items/"
    payload = {
        "name": name,
        "quantity": "1",
        "category": "Test",
        "expiry_date": (datetime.now() + timedelta(days=5)).isoformat(),
        "storage_type": "fridge"
    }
    res = requests.post(url, json=payload)
    if res.status_code == 200:
        print("Item created successfully.")
        return True
    else:
        print(f"Failed to create item: {res.text}")
        return False

def check_item_exists(name):
    print(f"Checking if item exists: {name}")
    url = f"{BASE_URL}/items/"
    res = requests.get(url)
    if res.status_code == 200:
        items = res.json()
        found = any(i['name'] == name for i in items)
        print(f"Item found: {found}")
        return found
    else:
        print(f"Failed to fetch items: {res.text}")
        return False

def log_waste(name):
    print(f"Logging waste for item: {name}")
    url = f"{BASE_URL}/waste/log"
    payload = {
        "item_name": name,
        "reason": "Test Waste",
        "quantity_wasted": 1.0,
        "cost_lost": 5.0
    }
    res = requests.post(url, json=payload)
    if res.status_code == 200:
        print("Waste logged successfully.")
        return True
    else:
        print(f"Failed to log waste: {res.text}")
        return False

def main():
    item_name = "Verification Milk"
    
    # 1. Create Item
    if not create_item(item_name):
        return

    # 2. Verify it exists
    if not check_item_exists(item_name):
        print("Error: Item should exist but was not found.")
        return

    # 3. Log Waste
    if not log_waste(item_name):
        return

    # 4. Verify its presence based on fixed logic
    if check_item_exists(item_name):
        print("SUCCESS: Item still exists in inventory properly.")
    else:
        print("FAILURE: Item was incorrectly removed from inventory.")

if __name__ == "__main__":
    main()
