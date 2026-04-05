from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Fallback to sqlite if postgres is not available/configured
# Use /tmp for sqlite on Vercel if no DATABASE_URL is provided
if not os.getenv("DATABASE_URL") and os.getenv("VERCEL"):
    SQLALCHEMY_DATABASE_URL = "sqlite:////tmp/crumbiq.db"
else:
    SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./crumbiq.db")
# For production/postgres: "postgresql://user:password@localhost/dbname"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False} if "sqlite" in SQLALCHEMY_DATABASE_URL else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
