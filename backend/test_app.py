import pytest
from datetime import datetime, timezone, timedelta

def test_read_main(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "CrumbIQ Brain Online"}

# --- INVENTORY TESTS ---
def test_create_item_happy_path(client):
    future_date = (datetime.now(timezone.utc) + timedelta(days=5)).isoformat()
    response = client.post(
        "/items",
        json={
            "name": "Organic Milk",
            "quantity": "1 Gallon",
            "category": "Dairy",
            "expiry_date": future_date,
            "storage_type": "fridge",
            "is_leftover": False
        }
    )
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["name"] == "Organic Milk"
    assert "id" in data
    assert "risk_score" in data
    assert "risk_status" in data
    assert isinstance(data["risk_score"], int)

def test_create_item_no_expiry_date(client):
    response = client.post(
        "/items",
        json={
            "name": "Apples",
            "quantity": "5 units",
            "category": "Produce",
            "storage_type": "pantry"
        }
    )
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["name"] == "Apples"
    assert data["expiry_date"] is not None # Should be auto-calculated

def test_get_items(client):
    # Setup step
    client.post("/items", json={"name": "Test Item 1", "quantity": "1", "category": "Pantry"})
    client.post("/items", json={"name": "Test Item 2", "quantity": "2", "category": "Produce"})
    
    response = client.get("/items")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 2


# --- WASTE TESTS ---
def test_log_waste_removes_inventory(client):
    # 1. Create an item
    client.post("/items", json={
        "name": "Test Avocado",
        "quantity": "1 unit",
        "category": "Produce"
    })
    
    # Verify it exists
    items_res = client.get("/items")
    assert any(i["name"] == "Test Avocado" for i in items_res.json())
    
    # 2. Log it as waste
    waste_res = client.post("/waste/log", json={
        "item_name": "Test Avocado",
        "reason": "Spoiled before use",
        "quantity_wasted": 0.2,
        "cost_lost": 1.50
    })
    assert waste_res.status_code == 200
    
    # 3. Verify it is removed from inventory
    items_res_after = client.get("/items")
    assert not any(i["name"] == "Test Avocado" for i in items_res_after.json())


# --- SHOPPING TESTS ---
def test_shopping_smart_generator_deduplication(client):
    # 1. Clear state implicitly via fresh db_session, but let's assure Milk is in inventory
    client.post("/items", json={
        "name": "Whole Milk",
        "quantity": "1 unit",
        "category": "Dairy"
    })
    
    # 2. Add Bread to shopping list manually
    client.post("/shopping/add", json={
        "name": "Bread",
        "quantity": "1 loaf",
        "category": "Pantry"
    })
    
    # 3. Generate Smart List (staples: Milk, Bread, Eggs, Rice, Onions)
    res = client.post("/shopping/generate_smart")
    assert res.status_code == 200
    added_items = res.json()["added_items"]
    
    # Milk is in inventory, Bread is in list -> should only add Eggs, Rice, Onions
    assert "Milk" not in added_items
    assert "Bread" not in added_items
    assert "Eggs" in added_items
    assert "Rice" in added_items
    assert "Onions" in added_items


# --- ANALYTICS / INSIGHTS TESTS ---
def test_analytics_smoke(client):
    res = client.get("/analytics/impact")
    assert res.status_code == 200
    data = res.json()
    assert "co2_saved_kg" in data
    assert "financial_savings_usd" in data
    assert "monthly_trend" in data

def test_insights_smoke(client):
    res = client.get("/insights/behavioral")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    if len(data) > 0:
        assert "title" in data[0]
        assert "message" in data[0]
        assert "type" in data[0]
