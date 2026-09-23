import os
import uuid
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models.user import User, RoleEnum
from app.models.profiles import RecruiterProfile, InstitutionProfile
from app.models.career import CareerPath, Course, Internship
from app.models.job import JobPosting
from app.models.skill import Skill
from app.core.security import get_password_hash

# Ensure all tables are created
Base.metadata.create_all(bind=engine)

def seed_data():
    db: Session = SessionLocal()
    
    # Check if already seeded
    if db.query(CareerPath).first():
        print("Database already seeded. Skipping.")
        db.close()
        return

    print("Seeding database...")
    
    # 1. Base Skills
    skills = [
        "python", "java", "javascript", "react", "sql", "aws", "docker",
        "machine learning", "communication", "leadership", "fastapi"
    ]
    for s_name in skills:
        db.add(Skill(id=str(uuid.uuid4()), name=s_name))
        
    # 2. Career Paths
    careers = [
        CareerPath(
            title="Software Engineer", domain="Software Engineering",
            description="Design, develop, and maintain software applications.",
            avg_salary_inr=800000, growth_rate=12.5,
            required_skills=["python", "fastapi", "sql", "javascript"],
            preferred_skills=["aws", "docker", "react"],
            min_experience_years=0.0
        ),
        CareerPath(
            title="Data Scientist", domain="Data Science & AI",
            description="Analyze complex data to help companies make better decisions.",
            avg_salary_inr=1000000, growth_rate=15.0,
            required_skills=["python", "sql", "machine learning"],
            preferred_skills=["aws", "docker"],
            min_experience_years=1.0
        ),
        CareerPath(
            title="Frontend Developer", domain="Frontend Development",
            description="Build user interfaces and web applications.",
            avg_salary_inr=600000, growth_rate=10.0,
            required_skills=["javascript", "react", "communication"],
            preferred_skills=["fastapi", "aws"],
            min_experience_years=0.0
        )
    ]
    db.add_all(careers)
    
    # 3. Courses
    courses = [
        # Courses (Now internal to SkillBridge)
        Course(title="Python for Everybody", provider="SkillBridge", skill_name="python", level="Beginner", duration_weeks=4, is_free=True),
        Course(title="JavaScript Basics", provider="SkillBridge", skill_name="javascript", level="Beginner", duration_weeks=4, is_free=True),
        Course(title="Advanced React Patterns", provider="SkillBridge", skill_name="react", level="Advanced", duration_weeks=6, is_free=False, rating=4.8),
        Course(title="SQL for Data Science", provider="SkillBridge", skill_name="sql", level="Intermediate", duration_weeks=5, is_free=True, rating=4.7),
        Course(title="Machine Learning A-Z", provider="SkillBridge", skill_name="machine learning", level="Intermediate", duration_weeks=10, is_free=False, rating=4.9),
        Course(title="Docker Mastery", provider="SkillBridge", skill_name="docker", level="Intermediate", duration_weeks=3, is_free=False),
        Course(title="AWS Cloud Practitioner", provider="SkillBridge", skill_name="aws", level="Beginner", duration_weeks=4, is_free=False),
        Course(title="FastAPI Full Stack", provider="SkillBridge", skill_name="fastapi", level="Intermediate", duration_weeks=5, is_free=True),
    ]
    db.add_all(courses)

    # 4. Users (Recruiter)
    recruiter_user = User(
        id=str(uuid.uuid4()), email="recruiter@techcorp.com",
        hashed_password=get_password_hash("password123"), role=RoleEnum.RECRUITER
    )
    db.add(recruiter_user)
    db.commit()
    
    recruiter_profile = RecruiterProfile(
        id=str(uuid.uuid4()), user_id=recruiter_user.id, company_name="TechCorp Inc."
    )
    db.add(recruiter_profile)
    db.commit()

    # 5. Internships & Jobs
    internships = [
        Internship(
            recruiter_id=recruiter_profile.id, title="Software Engineering Intern",
            company="TechCorp Inc.", description="Join our backend team to build scalable APIs.",
            required_skills=["python", "fastapi"], stipend_monthly=25000, duration_months=3, is_remote=True
        ),
        Internship(
            recruiter_id=recruiter_profile.id, title="Data Science Intern",
            company="TechCorp Inc.", description="Help analyze our user data.",
            required_skills=["python", "sql", "machine learning"], stipend_monthly=30000, duration_months=6, is_remote=False
        )
    ]
    db.add_all(internships)
    
    jobs = [
        JobPosting(
            recruiter_id=recruiter_profile.id, title="Junior Backend Developer",
            description="We need a FastAPI and Python expert to scale our systems. Docker knowledge is a plus.",
            is_active=True
        ),
        JobPosting(
            recruiter_id=recruiter_profile.id, title="React Frontend Engineer",
            description="Looking for a React developer to build interactive dashboards.",
            is_active=True
        )
    ]
    db.add_all(jobs)
    
    db.commit()
    print("Seed data inserted successfully!")
    db.close()

if __name__ == "__main__":
    seed_data()
