import requests

BACKEND_URL = "http://localhost:8000"

def test_endpoint(name, path):
    try:
        res = requests.get(f"{BACKEND_URL}{path}")
        print(f"{name}: {res.status_code} - {res.json() if res.status_code == 200 else 'Error: ' + res.text}")
        return res.status_code == 200
    except Exception as e:
        print(f"{name} failed: {e}")
        return False

if __name__ == "__main__":
    tests = [
        ("Root", "/"),
        ("Inventory", "/items"),
        ("Waste", "/waste"),
        ("Analytics", "/analytics/impact"),
        ("Insights", "/insights/behavioral"),
        ("Planner", "/planner/suggestions")
    ]
    
    all_success = True
    for name, path in tests:
        if not test_endpoint(name, path):
            all_success = False
            
    print("\n" + "="*20)
    print("FINAL RESULT: " + ("SUCCESS" if all_success else "FAILURE"))
    print("="*20)
