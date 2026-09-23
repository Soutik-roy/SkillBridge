"""
Seed lessons for all existing courses.
Run: python seed_lessons.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, engine, Base
from app.models import *  # noqa
from app.models.career import Course
from app.models.learning import CourseLesson

Base.metadata.create_all(bind=engine)

LESSONS_BY_SKILL = {
    "python": [
        ("Python Basics: Variables & Data Types", """
## Variables and Data Types in Python

Python is a dynamically-typed language — you don't declare types, Python figures them out.

### Core Data Types
- **int** → `age = 25`
- **float** → `price = 99.9`
- **str** → `name = "SkillBridge"`
- **bool** → `is_active = True`
- **list** → `skills = ["Python", "SQL"]`
- **dict** → `user = {"name": "Rahul", "age": 22}`

### Example
```python
name = "Priya"
score = 95.5
skills = ["Python", "React", "SQL"]

print(f"Name: {name}, Score: {score}")
print(f"Total skills: {len(skills)}")
```

### Key Concepts
- Use `type()` to check any variable's type
- Lists are ordered and mutable; tuples are immutable
- Dictionaries store key-value pairs — great for structured data

**Practice:** Create a dictionary representing your profile with name, age, skills (list), and is_student (bool).
        """, 10),
        ("Control Flow: if, for, while", """
## Control Flow in Python

### if / elif / else
```python
score = 85

if score >= 90:
    print("Grade: A")
elif score >= 70:
    print("Grade: B")
else:
    print("Grade: C")
```

### for Loops
```python
skills = ["Python", "SQL", "React"]

for skill in skills:
    print(f"Learning: {skill}")

# Range loop
for i in range(5):
    print(i)  # 0 1 2 3 4
```

### while Loops
```python
count = 0
while count < 3:
    print(f"Attempt {count + 1}")
    count += 1
```

### List Comprehensions (Pythonic way)
```python
scores = [85, 92, 78, 95]
passed = [s for s in scores if s >= 80]
print(passed)  # [85, 92, 95]
```

**Practice:** Write a program that prints the first 10 even numbers using a for loop.
        """, 15),
        ("Functions and Modules", """
## Functions in Python

### Defining Functions
```python
def calculate_score(correct, total):
    return round((correct / total) * 100, 2)

result = calculate_score(8, 10)
print(f"Score: {result}%")  # Score: 80.0%
```

### Default Arguments
```python
def greet(name, role="Student"):
    return f"Hello {name}, welcome to SkillBridge as a {role}!"

print(greet("Rahul"))
print(greet("Priya", "Recruiter"))
```

### *args and **kwargs
```python
def add_skills(*skills):
    for skill in skills:
        print(f"Added skill: {skill}")

add_skills("Python", "SQL", "Docker")
```

### Lambda Functions
```python
square = lambda x: x ** 2
print(square(5))  # 25

# Used in sorted()
students = [("Rahul", 85), ("Priya", 92), ("Amit", 78)]
sorted_students = sorted(students, key=lambda s: s[1], reverse=True)
```

**Practice:** Write a function `is_pass(score, threshold=60)` that returns True if score >= threshold.
        """, 20),
        ("Exception Handling", """
## Exception Handling

### try / except / finally
```python
def safe_divide(a, b):
    try:
        result = a / b
        return result
    except ZeroDivisionError:
        print("Error: Cannot divide by zero!")
        return None
    finally:
        print("Division attempted.")

print(safe_divide(10, 2))   # 5.0
print(safe_divide(10, 0))   # Error: Cannot divide by zero!
```

### Multiple Exceptions
```python
def parse_age(value):
    try:
        age = int(value)
        if age < 0:
            raise ValueError("Age cannot be negative")
        return age
    except ValueError as e:
        print(f"Invalid age: {e}")
    except TypeError:
        print("Age must be a number")
```

### Custom Exceptions
```python
class InsufficientScoreError(Exception):
    pass

def check_eligibility(score):
    if score < 60:
        raise InsufficientScoreError(f"Score {score} is below minimum 60")
    return True
```

**Practice:** Write a function that reads a number from user input and handles ValueError if non-numeric input is given.
        """, 15),
        ("Working with Files and APIs", """
## Files and REST APIs in Python

### Reading / Writing Files
```python
# Write to file
with open("scores.txt", "w") as f:
    f.write("Rahul: 95\\n")
    f.write("Priya: 88\\n")

# Read from file
with open("scores.txt", "r") as f:
    for line in f:
        print(line.strip())

# JSON files
import json

data = {"name": "Rahul", "score": 95}
with open("data.json", "w") as f:
    json.dump(data, f)

with open("data.json", "r") as f:
    loaded = json.load(f)
print(loaded)
```

### Calling REST APIs with requests
```python
import requests

# GET request
response = requests.get("https://api.github.com/users/python")
data = response.json()
print(data["name"])

# POST request
payload = {"skill": "python", "level": "advanced"}
response = requests.post("http://localhost:8000/api/v1/quiz/start", json=payload)
print(response.status_code, response.json())
```

**Practice:** Call the SkillBridge quiz API using requests and print the list of questions for "python".

🎉 **Congratulations! You have completed the Python course on SkillBridge!**
        """, 20),
    ],
    "sql": [
        ("Introduction to SQL and Databases", """
## What is SQL?

SQL (Structured Query Language) is the standard language for managing relational databases.

### Key Concepts
- **Database**: A collection of organized data (e.g., SkillBridge DB)
- **Table**: Like a spreadsheet — rows and columns
- **Row (Record)**: One entry (e.g., one student)
- **Column (Field)**: One attribute (e.g., name, email)

### Your First Queries
```sql
-- Select all students
SELECT * FROM students;

-- Select specific columns
SELECT name, email, score FROM students;

-- Filter with WHERE
SELECT * FROM students WHERE score >= 80;

-- Sort results
SELECT name, score FROM students ORDER BY score DESC;

-- Limit results
SELECT * FROM jobs ORDER BY created_at DESC LIMIT 10;
```

### Data Types
- `VARCHAR(n)` — text up to n characters
- `INTEGER` / `INT` — whole numbers
- `FLOAT` / `DECIMAL` — decimal numbers
- `BOOLEAN` — true/false
- `TIMESTAMP` — date and time

**Practice:** Write a query to select all jobs where `is_active = true`, ordered by creation date newest first.
        """, 15),
        ("Filtering, Sorting and Aggregation", """
## Advanced Filtering and Aggregation

### WHERE Clauses
```sql
-- Multiple conditions
SELECT * FROM students 
WHERE score >= 70 AND role = 'STUDENT';

-- IN operator
SELECT * FROM jobs 
WHERE title IN ('Software Engineer', 'Data Scientist');

-- LIKE for pattern matching
SELECT * FROM users 
WHERE email LIKE '%@gmail.com';

-- BETWEEN
SELECT * FROM courses 
WHERE duration_weeks BETWEEN 4 AND 8;
```

### Aggregate Functions
```sql
-- Count of students
SELECT COUNT(*) FROM students;

-- Average score
SELECT AVG(score) FROM assessments;

-- Max and Min
SELECT MAX(stipend_monthly), MIN(stipend_monthly) FROM internships;

-- Sum
SELECT SUM(duration_weeks) FROM courses WHERE skill_name = 'python';
```

### GROUP BY
```sql
-- Count jobs per company
SELECT company, COUNT(*) as job_count
FROM internships
GROUP BY company
ORDER BY job_count DESC;

-- Average score per skill
SELECT skill_name, AVG(score) as avg_score
FROM skill_assessments
GROUP BY skill_name
HAVING AVG(score) > 60;
```

**Practice:** Write a query to find the number of applications per job, showing only jobs with more than 5 applications.
        """, 20),
        ("JOINs: Combining Tables", """
## SQL JOINs

JOINs link data from multiple tables using related columns.

### INNER JOIN (most common)
Returns only matching rows from both tables.

```sql
-- Get student name + their applications
SELECT users.email, jobs.title, applications.status
FROM applications
INNER JOIN students ON applications.student_id = students.id
INNER JOIN users ON students.user_id = users.id
INNER JOIN jobs ON applications.job_id = jobs.id;
```

### LEFT JOIN
Returns all rows from left table, matching rows from right.

```sql
-- All students, even those with no applications
SELECT users.email, COUNT(applications.id) as app_count
FROM users
LEFT JOIN students ON users.id = students.user_id
LEFT JOIN applications ON students.id = applications.student_id
WHERE users.role = 'STUDENT'
GROUP BY users.email;
```

### JOIN Summary
| Type | Returns |
|------|---------|
| INNER JOIN | Only matched rows |
| LEFT JOIN | All from left + matched from right |
| RIGHT JOIN | All from right + matched from left |
| FULL JOIN | All rows from both |

**Practice:** Write a query to show all job titles and how many students applied for each (include jobs with 0 applications using LEFT JOIN).
        """, 20),
        ("Indexes, Constraints and Performance", """
## Database Performance

### Primary & Foreign Keys
```sql
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    name VARCHAR(200) NOT NULL,
    score FLOAT DEFAULT 0.0
);
```

### UNIQUE Constraint
```sql
ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email);
```

### Indexes for Speed
```sql
-- Create index on commonly filtered column
CREATE INDEX idx_jobs_active ON jobs(is_active);
CREATE INDEX idx_applications_student ON applications(student_id);

-- Check query plan (PostgreSQL)
EXPLAIN ANALYZE SELECT * FROM jobs WHERE is_active = true;
```

### Performance Tips
1. **Index foreign keys** — always index columns used in JOINs
2. **Avoid SELECT *** — only select needed columns
3. **Use LIMIT** — don't fetch all rows if you only need 10
4. **Analyze slow queries** — use EXPLAIN to see what's happening

**Practice:** Identify which columns in a student applications table should be indexed and explain why.
        """, 15),
        ("Real-World SQL Project", """
## Building a Student Analytics Query

Let's write the full analytics query for the SkillBridge platform dashboard.

### Requirements
- Show each student's: name, email, skill count, average score, number of applications, placement status

```sql
WITH student_stats AS (
    SELECT 
        s.id,
        u.email,
        COUNT(DISTINCT sa.id) as skill_count,
        ROUND(AVG(sa.score), 1) as avg_score
    FROM student_profiles s
    JOIN users u ON s.user_id = u.id
    LEFT JOIN skill_assessments sa ON s.id = sa.student_id
    GROUP BY s.id, u.email
),
application_stats AS (
    SELECT 
        student_id,
        COUNT(*) as total_applications,
        COUNT(CASE WHEN status = 'ACCEPTED' THEN 1 END) as placements
    FROM job_applications
    GROUP BY student_id
)
SELECT 
    ss.email,
    ss.skill_count,
    ss.avg_score,
    COALESCE(aps.total_applications, 0) as applications,
    COALESCE(aps.placements, 0) as placements,
    CASE 
        WHEN aps.placements > 0 THEN 'Placed'
        WHEN aps.total_applications > 0 THEN 'Interviewing'
        ELSE 'Searching'
    END as status
FROM student_stats ss
LEFT JOIN application_stats aps ON ss.id = aps.student_id
ORDER BY ss.avg_score DESC;
```

🎉 **Congratulations! You have completed the SQL course on SkillBridge!**
        """, 25),
    ],
    "machine learning": [
        ("What is Machine Learning?", """
## Introduction to Machine Learning

Machine Learning (ML) is a subset of AI where systems learn from data to make predictions or decisions without being explicitly programmed.

### Types of ML
1. **Supervised Learning** — Learning from labeled data
   - Input: Features + Labels → Output: Predictions
   - Examples: Email spam detection, house price prediction

2. **Unsupervised Learning** — Finding patterns in unlabeled data
   - Examples: Customer segmentation, anomaly detection

3. **Reinforcement Learning** — Learning through rewards and penalties
   - Examples: Game playing AI, robot navigation

### The ML Workflow
```
Data Collection → Data Cleaning → Feature Engineering 
→ Model Training → Model Evaluation → Deployment
```

### Key Terms
- **Feature**: Input variable (e.g., years of experience)
- **Label/Target**: Output variable (e.g., salary)
- **Training set**: Data used to learn
- **Test set**: Data used to evaluate (never seen during training)
- **Model**: The mathematical function learned from data

**Practice:** Identify 3 real-world problems in your daily life that could be solved with ML. For each, define the features and the target output.
        """, 15),
        ("Data Preprocessing", """
## Data Preprocessing with Pandas

Real-world data is messy. Preprocessing is 80% of ML work.

### Loading and Exploring Data
```python
import pandas as pd
import numpy as np

df = pd.read_csv("students.csv")

# Basic exploration
print(df.shape)          # (rows, columns)
print(df.info())         # data types, null counts
print(df.describe())     # statistical summary
print(df.head())         # first 5 rows
```

### Handling Missing Values
```python
# Find missing values
print(df.isnull().sum())

# Drop rows with any missing values
df_clean = df.dropna()

# Fill missing with mean/median
df['score'].fillna(df['score'].mean(), inplace=True)
df['skill'].fillna('Unknown', inplace=True)
```

### Encoding Categorical Variables
```python
# Label encoding
df['level_encoded'] = df['level'].map({
    'BEGINNER': 0, 'INTERMEDIATE': 1, 'ADVANCED': 2, 'EXPERT': 3
})

# One-hot encoding
df = pd.get_dummies(df, columns=['domain'])
```

### Feature Scaling
```python
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
df[['score', 'experience']] = scaler.fit_transform(df[['score', 'experience']])
```

**Practice:** Load a CSV file, find missing values, fill them appropriately, and encode a categorical column.
        """, 20),
        ("Training Your First Model", """
## Building a Classification Model

We'll predict if a student will get placed based on their skill score.

```python
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

# Sample data
data = {
    'skill_score': [85, 45, 92, 60, 30, 78, 55, 95],
    'years_exp': [2, 0, 3, 1, 0, 2, 1, 4],
    'placed': [1, 0, 1, 0, 0, 1, 0, 1]
}
df = pd.DataFrame(data)

# Split features and target
X = df[['skill_score', 'years_exp']]
y = df['placed']

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Predict and evaluate
y_pred = model.predict(X_test)
print(f"Accuracy: {accuracy_score(y_test, y_pred):.2f}")
print(classification_report(y_test, y_pred))

# Predict for a new student
new_student = [[72, 1]]
prediction = model.predict(new_student)
print("Placed!" if prediction[0] == 1 else "Not placed yet")
```

**Practice:** Add a third feature (number of projects) to the model and see if accuracy improves.
        """, 25),
        ("Evaluating and Improving Models", """
## Model Evaluation Metrics

### For Classification
```python
from sklearn.metrics import (
    accuracy_score, precision_score, 
    recall_score, f1_score, confusion_matrix
)

# Accuracy: % of correct predictions
print(f"Accuracy: {accuracy_score(y_test, y_pred):.2f}")

# Precision: When we say positive, how often correct?
print(f"Precision: {precision_score(y_test, y_pred):.2f}")

# Recall: Of all actual positives, how many did we catch?
print(f"Recall: {recall_score(y_test, y_pred):.2f}")

# F1 Score: Balance of precision and recall
print(f"F1 Score: {f1_score(y_test, y_pred):.2f}")

# Confusion Matrix
print(confusion_matrix(y_test, y_pred))
```

### Preventing Overfitting
```python
from sklearn.model_selection import cross_val_score

# 5-fold cross validation — more reliable than single split
scores = cross_val_score(model, X, y, cv=5, scoring='accuracy')
print(f"CV Accuracy: {scores.mean():.2f} (+/- {scores.std():.2f})")
```

### Hyperparameter Tuning
```python
from sklearn.model_selection import GridSearchCV

param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [None, 5, 10]
}

grid_search = GridSearchCV(
    RandomForestClassifier(), param_grid, cv=5, scoring='accuracy'
)
grid_search.fit(X_train, y_train)
print(f"Best params: {grid_search.best_params_}")
```

**Practice:** Use cross-validation to compare accuracy of RandomForest vs LogisticRegression on the placement dataset.
        """, 20),
        ("Deploying ML with FastAPI", """
## Serving Your Model as an API

### Save and Load the Model
```python
import pickle
from sklearn.ensemble import RandomForestClassifier

# Train and save
model.fit(X_train, y_train)
with open("placement_model.pkl", "wb") as f:
    pickle.dump(model, f)

# Load later
with open("placement_model.pkl", "rb") as f:
    loaded_model = pickle.load(f)
```

### Wrap it in a FastAPI endpoint
```python
from fastapi import FastAPI
from pydantic import BaseModel
import pickle
import numpy as np

app = FastAPI()

with open("placement_model.pkl", "rb") as f:
    model = pickle.load(f)

class StudentFeatures(BaseModel):
    skill_score: float
    years_experience: float

@app.post("/predict-placement")
def predict(student: StudentFeatures):
    features = np.array([[student.skill_score, student.years_experience]])
    prediction = model.predict(features)[0]
    probability = model.predict_proba(features)[0][1]
    return {
        "placed": bool(prediction),
        "confidence": round(float(probability) * 100, 1)
    }
```

### Test it
```bash
curl -X POST http://localhost:8000/predict-placement \\
  -H "Content-Type: application/json" \\
  -d '{"skill_score": 85, "years_experience": 2}'
```

🎉 **Congratulations! You have completed the Machine Learning course on SkillBridge!**
        """, 25),
    ],
    "fastapi": [
        ("Introduction to FastAPI", """
## Why FastAPI?

FastAPI is the fastest way to build production-ready APIs in Python.

### Key Features
- **Automatic Swagger docs** at `/docs`
- **Type safety** with Pydantic
- **Async support** out of the box
- **90% less bugs** (type checking catches issues early)

### Your First API
```python
from fastapi import FastAPI

app = FastAPI(title="My First API", version="1.0.0")

@app.get("/")
def root():
    return {"message": "Hello from FastAPI!"}

@app.get("/items/{item_id}")
def get_item(item_id: int, name: str = None):
    return {"id": item_id, "name": name}
```

### Run it
```bash
pip install fastapi uvicorn
uvicorn main:app --reload
# Open http://localhost:8000/docs
```

### Path vs Query Parameters
```python
# Path parameter: /users/42
@app.get("/users/{user_id}")
def get_user(user_id: int):
    return {"user_id": user_id}

# Query parameter: /users?role=student&limit=10
@app.get("/users")
def list_users(role: str = "student", limit: int = 10):
    return {"role": role, "limit": limit}
```

**Practice:** Create a FastAPI app with a `/skills/{skill_name}` endpoint that returns a description of the skill.
        """, 15),
        ("Request Bodies with Pydantic", """
## Pydantic Models for Data Validation

Pydantic validates incoming data automatically — no manual checks needed.

```python
from fastapi import FastAPI
from pydantic import BaseModel, EmailStr
from typing import Optional, List

app = FastAPI()

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role: str = "STUDENT"
    skills: List[str] = []

class UserOut(BaseModel):
    id: str
    email: str
    role: str
    
    class Config:
        from_attributes = True

@app.post("/users", response_model=UserOut, status_code=201)
def create_user(user: UserCreate):
    # FastAPI automatically validates the request body
    # If email is invalid, it returns 422 Unprocessable Entity
    print(f"Creating user: {user.email} with role {user.role}")
    return {"id": "uuid-here", "email": user.email, "role": user.role}
```

### Field Validation
```python
from pydantic import BaseModel, field_validator

class SkillAssessment(BaseModel):
    skill_name: str
    score: float
    
    @field_validator('score')
    def score_must_be_valid(cls, v):
        if not 0 <= v <= 100:
            raise ValueError('Score must be between 0 and 100')
        return v
    
    @field_validator('skill_name')
    def skill_name_lowercase(cls, v):
        return v.lower().strip()
```

**Practice:** Create a Pydantic model for a job application with required fields: job_id, cover_letter (min 50 chars), and expected_salary (positive number).
        """, 20),
        ("Database with SQLAlchemy", """
## Connecting FastAPI to PostgreSQL

### Setup
```python
# database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

DATABASE_URL = "postgresql://user:password@localhost/mydb"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass

def get_db():
    db = SessionLocal()
    try:
        yield db  # FastAPI dependency injection
    finally:
        db.close()
```

### Model Definition
```python
# models.py
from sqlalchemy import Column, String, Float, DateTime
from database import Base
import uuid
from datetime import datetime

class Skill(Base):
    __tablename__ = "skills"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False, unique=True)
    score = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
```

### CRUD Operations
```python
from fastapi import Depends
from sqlalchemy.orm import Session

@app.get("/skills")
def get_skills(db: Session = Depends(get_db)):
    return db.query(Skill).all()

@app.post("/skills", status_code=201)
def create_skill(name: str, db: Session = Depends(get_db)):
    skill = Skill(name=name)
    db.add(skill)
    db.commit()
    db.refresh(skill)
    return skill
```

**Practice:** Add a DELETE endpoint that removes a skill by ID and returns 404 if not found.
        """, 25),
        ("Authentication with JWT", """
## Securing APIs with JWT Tokens

### Install dependencies
```bash
pip install python-jose[cryptography] passlib bcrypt
```

### Security utilities
```python
from jose import jwt, JWTError
from passlib.context import CryptContext
from datetime import datetime, timedelta

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"])

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_token(data: dict) -> str:
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(hours=24)
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        return None
```

### Protected Routes
```python
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload

@app.get("/protected")
def protected_route(user = Depends(get_current_user)):
    return {"message": f"Hello {user['email']}"}
```

**Practice:** Add a role-based check so only users with `role='ADMIN'` can access a `/admin/users` endpoint.
        """, 20),
        ("Deployment and Best Practices", """
## Deploying FastAPI to Production

### Project Structure (Best Practice)
```
my_api/
├── app/
│   ├── main.py          ← FastAPI app
│   ├── database.py      ← DB connection
│   ├── models/          ← SQLAlchemy models
│   ├── schemas/         ← Pydantic schemas
│   ├── api/routes/      ← Route handlers
│   └── services/        ← Business logic
├── requirements.txt
├── .env                 ← Secrets (never commit!)
└── Dockerfile
```

### Environment Variables
```python
# Never hardcode secrets!
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
SECRET_KEY = os.getenv("SECRET_KEY")
```

### Dockerfile
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### CORS Middleware
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourfrontend.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

🎉 **Congratulations! You have completed the FastAPI course on SkillBridge!**
        """, 20),
    ],
}

# Short lesson stubs for remaining skills
STUB_LESSONS = {
    "react": [
        ("React Fundamentals & JSX", "## React Basics\n\nReact is a JavaScript library for building UIs.\n\n```jsx\nfunction Welcome({ name }) {\n  return <h1>Hello, {name}!</h1>;\n}\n```\n\n**JSX** lets you write HTML-like code inside JavaScript.", 15),
        ("State and useState Hook", "## Managing State\n\n```jsx\nimport { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>+</button>\n    </div>\n  );\n}\n```", 20),
        ("useEffect and Data Fetching", "## Side Effects with useEffect\n\n```jsx\nconst [data, setData] = useState([]);\n\nuseEffect(() => {\n  fetch('/api/courses')\n    .then(r => r.json())\n    .then(setData);\n}, []); // Empty array = run once on mount\n```", 20),
        ("React Router & Navigation", "## Client-Side Routing\n\n```jsx\nimport { BrowserRouter, Routes, Route, Link } from 'react-router-dom';\n\n<Routes>\n  <Route path='/' element={<Home />} />\n  <Route path='/courses' element={<Courses />} />\n</Routes>\n```", 15),
        ("Building a Complete React App", "## Final Project\n\nBuild a skill tracker app:\n1. List skills with scores\n2. Add new skills via form\n3. Filter skills by domain\n4. Connect to FastAPI backend\n\n🎉 **Course Complete!**", 25),
    ],
    "docker": [
        ("What is Docker?", "## Docker Fundamentals\n\nDocker packages apps with all dependencies into **containers** — consistent everywhere.\n\n```bash\ndocker run hello-world\ndocker pull python:3.11\ndocker images\n```", 10),
        ("Writing Dockerfiles", "## Dockerfile Basics\n\n```dockerfile\nFROM python:3.11-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install -r requirements.txt\nCOPY . .\nCMD [\"uvicorn\", \"main:app\", \"--host\", \"0.0.0.0\"]\n```\n\n```bash\ndocker build -t myapp .\ndocker run -p 8000:8000 myapp\n```", 20),
        ("Docker Volumes and Networks", "## Persisting Data\n\n```bash\n# Mount a volume\ndocker run -v /local/path:/container/path myapp\n\n# Create network\ndocker network create skillbridge-net\ndocker run --network skillbridge-net myapp\n```", 15),
        ("Docker Compose", "## docker-compose.yml\n\n```yaml\nversion: '3'\nservices:\n  api:\n    build: ./backend\n    ports: [\"8000:8000\"]\n    depends_on: [db]\n  db:\n    image: postgres:15\n    environment:\n      POSTGRES_PASSWORD: secret\n```\n\n```bash\ndocker-compose up -d\n```", 20),
        ("Production Docker Best Practices", "## Production Tips\n1. Use `.dockerignore` to exclude node_modules, .env\n2. Use multi-stage builds to reduce image size\n3. Never run as root in containers\n4. Pin image versions (not `latest`)\n\n🎉 **Docker Course Complete!**", 15),
    ],
    "aws": [
        ("AWS Core Services Overview", "## AWS Fundamentals\n\n- **EC2** — Virtual servers\n- **S3** — Object storage\n- **RDS** — Managed databases\n- **Lambda** — Serverless functions\n- **IAM** — Identity & access management\n\nAll services are accessed via AWS Console, CLI, or SDK.", 15),
        ("S3: Storage and Static Hosting", "## Amazon S3\n\n```bash\n# Create bucket\naws s3 mb s3://my-skillbridge-bucket\n\n# Upload file\naws s3 cp myfile.txt s3://my-skillbridge-bucket/\n\n# Sync frontend build\naws s3 sync ./dist s3://my-frontend-bucket/\n```", 20),
        ("EC2: Virtual Servers", "## Launching EC2\n\n1. Choose AMI (Ubuntu, Amazon Linux)\n2. Select instance type (t3.micro for free tier)\n3. Configure security groups (open port 80, 443, 22)\n4. Launch and SSH in\n\n```bash\nssh -i my-key.pem ubuntu@ec2-ip-address\n```", 20),
        ("IAM: Security Best Practices", "## Identity and Access Management\n\n- Never use root account for daily work\n- Create IAM users with minimum required permissions\n- Use roles for services (EC2, Lambda) instead of keys\n- Enable MFA on all accounts\n- Rotate access keys every 90 days", 15),
        ("Deploying to AWS", "## Full Deployment\n\n1. Push Docker image to ECR\n2. Deploy to ECS Fargate or EC2\n3. Add RDS PostgreSQL for database\n4. Configure Route 53 for domain\n5. Add SSL via ACM + Load Balancer\n\n🎉 **AWS Course Complete!**", 25),
    ],
    "javascript": [
        ("JavaScript Basics", "## JS Fundamentals\n\n```js\nconst name = 'Rahul';\nlet score = 0;\n\n// Functions\nconst greet = (name) => `Hello, ${name}!`;\n\n// Arrays\nconst skills = ['JS', 'React'];\nskills.push('Node');\nconsole.log(skills.length);\n```", 15),
        ("Async JavaScript", "## Promises and async/await\n\n```js\n// Fetch API data\nasync function getJobs() {\n  const res = await fetch('/api/v1/jobs');\n  const jobs = await res.json();\n  return jobs;\n}\n\ngetJobs().then(jobs => console.log(jobs));\n```", 20),
        ("DOM Manipulation", "## Working with the DOM\n\n```js\n// Select elements\nconst btn = document.querySelector('#submit-btn');\nconst list = document.getElementById('skill-list');\n\n// Add event listener\nbtn.addEventListener('click', () => {\n  const li = document.createElement('li');\n  li.textContent = 'New Skill';\n  list.appendChild(li);\n});\n```", 20),
        ("ES6+ Modern Features", "## Modern JavaScript\n\n```js\n// Destructuring\nconst { name, score } = student;\nconst [first, ...rest] = skills;\n\n// Spread operator\nconst updated = { ...student, score: 95 };\n\n// Optional chaining\nconst city = user?.profile?.address?.city ?? 'Unknown';\n```", 15),
        ("JavaScript Project: Quiz App", "## Build a Quiz App\n\nCreate a quiz game using vanilla JS:\n- Fetch questions from SkillBridge API\n- Display one question at a time\n- Track score\n- Show results at end\n\n🎉 **JavaScript Course Complete!**", 25),
    ],
}


def seed_lessons():
    db = SessionLocal()
    try:
        # Skip if already seeded
        if db.query(CourseLesson).first():
            print("Lessons already seeded. Skipping.")
            return

        all_lessons = {**LESSONS_BY_SKILL, **{k: [(t, c, d) for t, c, d in v] for k, v in STUB_LESSONS.items()}}
        courses = db.query(Course).all()
        seeded = 0

        for course in courses:
            skill = course.skill_name.lower()
            lesson_data = all_lessons.get(skill, [])
            for idx, lesson_tuple in enumerate(lesson_data, start=1):
                title, content, duration = lesson_tuple
                db.add(CourseLesson(
                    course_id=str(course.id),
                    order=idx,
                    title=title,
                    content=content.strip(),
                    duration_mins=duration,
                ))
                seeded += 1

        db.commit()
        print(f"[OK] Seeded {seeded} lessons across {len(courses)} courses!")
    finally:
        db.close()


if __name__ == "__main__":
    from app.database import SessionLocal
    seed_lessons()
