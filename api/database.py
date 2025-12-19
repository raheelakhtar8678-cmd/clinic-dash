from sqlalchemy import create_engine, pool
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///./clinicops.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=pool.NullPool # Disable connection pooling
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
