from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .models import *  # noqa – registers all models so metadata is populated
from .api.routes import auth, students, jobs, intelligence, quiz, courses, faculty, recruiters

# Auto-create all tables (SQLite fallback or real Postgres)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SkillBridge API",
    description="SIH MVP – Bridging Academia and Industry",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all domains (like Vercel) to access the API
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(students.router, prefix="/api/v1")
app.include_router(jobs.router, prefix="/api/v1")
app.include_router(intelligence.router, prefix="/api/v1")
app.include_router(quiz.router, prefix="/api/v1")
app.include_router(courses.router, prefix="/api/v1")
app.include_router(faculty.router, prefix="/api/v1")
app.include_router(recruiters.router, prefix="/api/v1")


@app.get("/")
def root():
    return {"message": "SkillBridge API is running ✅", "docs": "/docs"}
