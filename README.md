# SkillBridge — SIH MVP

An AI-driven platform bridging the gap between Academia and Industry.

## Overview
SkillBridge provides AI-driven skill assessments, gap analysis, career roadmaps, and deterministic job matching for students, recruiters, and institutions.

## Prerequisites
- Node.js (v18+)
- Python (3.10+)

## Quick Start (Local Development)

### 1. Start the Backend
The backend runs on **FastAPI** and defaults to **SQLite** if PostgreSQL is not available locally. This means you do NOT need Docker to test the application!

```bash
cd backend
# Create virtual environment
python -m venv venv

# Activate it (Windows)
.\venv\Scripts\activate
# Activate it (Mac/Linux)
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Seed the database with mock roles, courses, and jobs
python seed.py

# Start the server
uvicorn app.main:app --reload --port 8000
```
*Backend runs at: http://localhost:8000*
*API Docs: http://localhost:8000/docs*

### 2. Start the Frontend
The frontend uses **React, Vite, and Tailwind CSS**.

```bash
cd frontend
# Install dependencies
npm install

# Start the development server
npm run dev
```
*Frontend runs at: http://localhost:5173*

## Testing the Workflows

1. **Recruiter Flow**: Log in with `recruiter@techcorp.com` / `password123` to view candidate tracking and job management.
2. **Student Flow**: Click "Get Started" to register a new student account. Take the skill assessment, generate a career roadmap, and view AI job matches.
3. **Institution Flow**: Register as an Institution to view campus-wide placement analytics and skill gaps.
