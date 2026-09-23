import requests
import json

base_url = "http://localhost:8000/api/v1/engine"

# 1. Assess Skills
res_assess = requests.post(f"{base_url}/assess-skills", json={
    "skills": [
        {"skill_name": "python", "proficiency": "ADVANCED"},
        {"skill_name": "sql", "proficiency": "INTERMEDIATE"}
    ]
})
print("ASSESS SKILLS:", res_assess.json())

# 2. Recommend Careers
res_careers = requests.post(f"{base_url}/recommend-careers", json={
    "student_skills": [
        {"skill_name": "python", "proficiency": "ADVANCED"},
        {"skill_name": "sql", "proficiency": "INTERMEDIATE"}
    ],
    "top_n": 3
})
print("\nCAREERS:", res_careers.json())

# We need a career ID for roadmap & skill gap
career_id = res_careers.json()[0]['career_id']

# 3. Skill Gap
res_gap = requests.post(f"{base_url}/skill-gap", json={
    "student_skills": [
        {"skill_name": "python", "proficiency": "ADVANCED"}
    ],
    "target_career_id": career_id
})
print("\nSKILL GAP:", res_gap.json())

# 4. Recommend Courses
res_courses = requests.post(f"{base_url}/recommend-courses", json={
    "missing_skills": ["machine learning"],
    "top_n": 2
})
print("\nCOURSES:", res_courses.json())

# 5. Match Jobs
res_jobs = requests.post(f"{base_url}/match-jobs", json={
    "student_skills": [
        {"skill_name": "python", "proficiency": "ADVANCED"},
        {"skill_name": "fastapi", "proficiency": "INTERMEDIATE"}
    ]
})
print("\nJOBS:", res_jobs.json())

# 6. Roadmap
res_roadmap = requests.post(f"{base_url}/roadmap", json={
    "student_skills": [
        {"skill_name": "python", "proficiency": "BEGINNER"}
    ],
    "target_career_id": career_id
})
print("\nROADMAP:", res_roadmap.json())

