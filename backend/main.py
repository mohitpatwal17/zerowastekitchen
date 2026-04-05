from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from routers import inventory, planner, analytics, waste, shopping, insights, ai
from database import engine, Base
import database, models

# Create tables (for MVP simplicity, usually use Alembic)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="CrumbIQ API", description="AI-Driven Zero Waste Kitchen Brain")

@app.on_event("startup")
def startup_event():
    db = next(database.get_db())
    user = db.query(models.User).first()
    if not user:
        db.add(models.User(id=1, username="default_user", email="user@crumbiq.com", role="household"))
        db.commit()

# CORS Setup
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(inventory.router)
app.include_router(planner.router)
app.include_router(analytics.router)
app.include_router(waste.router)
app.include_router(shopping.router)
app.include_router(insights.router)
app.include_router(ai.router)

@app.middleware("http")
async def add_pna_header(request: Request, call_next):
    response = await call_next(request)
    response.headers["Access-Control-Allow-Private-Network"] = "true"
    return response

@app.get("/")
def read_root():
    return {"message": "CrumbIQ Brain Online"}
