import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# Load .env from the project root (two levels up from this file)
_env_path = os.path.join(os.path.dirname(__file__), "../../.env")
load_dotenv(_env_path)

DATABASE_URL = os.getenv("DATABASE_URL", "")

# If no DATABASE_URL is set OR it starts with postgresql but we can't connect, fall back to SQLite
_use_sqlite = not DATABASE_URL or DATABASE_URL.startswith("sqlite")

if _use_sqlite:
    DATABASE_URL = "sqlite:///./skillbridge.db"
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    # Try to reach Postgres; on failure fall back to SQLite transparently
    try:
        _pg_engine = create_engine(DATABASE_URL, pool_pre_ping=True)
        # Force a connection to check availability
        with _pg_engine.connect():
            pass
        engine = _pg_engine
    except Exception as e:
        print(f"[SkillBridge] PostgreSQL unavailable ({e}), falling back to SQLite.")
        DATABASE_URL = "sqlite:///./skillbridge.db"
        engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
