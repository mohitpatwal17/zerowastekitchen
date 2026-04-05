from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from routers import inventory, planner, analytics, waste, shopping, insights, ai
from database import engine, Base
import database, models

# Create tables (for MVP simplicity, usually use Alembic)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="CrumbIQ API", description="AI-Driven Zero Waste Kitchen Brain")

# CORS Setup
app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
)

# App Routers
app.include_router(inventory.router, tags=["inventory"])
app.include_router(planner.router, tags=["planner"])
app.include_router(analytics.router, tags=["analytics"])
app.include_router(waste.router, tags=["waste"])
app.include_router(shopping.router, tags=["shopping"])
app.include_router(insights.router, tags=["insights"])
app.include_router(ai.router, tags=["ai"])

@app.on_event("startup")
def startup_event():
    db = next(database.get_db())
    user = db.query(models.User).first()
    if not user:
        db.add(models.User(id=1, username="default_user", email="user@crumbiq.com", role="household"))
        db.commit()

@app.middleware("http")
async def add_pna_header(request: Request, call_next):
    response = await call_next(request)
    response.headers["Private-Network-Access-Name"] = "CrumbIQ"
    response.headers["Private-Network-Access-ID"] = "crumb-iq-brain"
    return response

@app.get("/")
async def root():
        return {"message": "CrumbIQ Brain Online"}
    
