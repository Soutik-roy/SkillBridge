from sqlalchemy import Column, String, Float, Integer, Text, Boolean, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base
import uuid


class CareerPath(Base):
    """A career role that students can be recommended for."""
    __tablename__ = "career_paths"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(200), nullable=False, unique=True)
    domain = Column(String(100), nullable=False)       # e.g. "Software Engineering"
    description = Column(Text, nullable=True)
    avg_salary_inr = Column(Integer, default=0)
    required_skills = Column(JSON, nullable=True)      # list of skill names
    preferred_skills = Column(JSON, nullable=True)
    min_experience_years = Column(Float, default=0.0)
    growth_rate = Column(Float, default=0.0)           # % YoY demand growth
    created_at = Column(DateTime, default=datetime.utcnow)


class Course(Base):
    """An online/offline course that can fill a skill gap."""
    __tablename__ = "courses"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(200), nullable=False)
    provider = Column(String(100), nullable=False)     # SkillBridge (internal)
    teacher_id = Column(String(36), ForeignKey("institution_profiles.id"), nullable=True) # If created by a specific teacher
    skill_name = Column(String(100), nullable=False)   # primary skill taught
    level = Column(String(50), default="Beginner")
    duration_weeks = Column(Integer, default=4)
    is_free = Column(Boolean, default=True)
    url = Column(String(500), nullable=True)
    rating = Column(Float, default=4.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    lessons = relationship("CourseLesson", back_populates="course", order_by="CourseLesson.order")


class Internship(Base):
    """An internship posting similar to a job posting."""
    __tablename__ = "internships"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    recruiter_id = Column(String(36), ForeignKey("recruiter_profiles.id"), nullable=True)
    title = Column(String(200), nullable=False)
    company = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    required_skills = Column(JSON, nullable=True)      # list of skill names
    stipend_monthly = Column(Integer, default=0)
    duration_months = Column(Integer, default=2)
    is_remote = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    recruiter = relationship("RecruiterProfile")


class CareerRoadmap(Base):
    """A persisted personalised roadmap for a student."""
    __tablename__ = "career_roadmaps"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    student_id = Column(String(36), ForeignKey("student_profiles.id"), nullable=False)
    target_career = Column(String(200), nullable=False)
    overall_match_score = Column(Float, default=0.0)
    phases = Column(JSON, nullable=True)               # list of phase dicts
    ai_explanation = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("StudentProfile")
