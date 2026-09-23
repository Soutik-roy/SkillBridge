from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Enum as SAEnum, Float, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base
import enum
import uuid


class ApplicationStatus(enum.Enum):
    APPLIED = "APPLIED"
    REVIEWING = "REVIEWING"
    SHORTLISTED = "SHORTLISTED"
    INTERVIEW = "INTERVIEW"
    ACCEPTED = "ACCEPTED"
    REJECTED = "REJECTED"


class JobPosting(Base):
    __tablename__ = "job_postings"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    recruiter_id = Column(String(36), ForeignKey("recruiter_profiles.id"))
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    required_skills = Column(JSON, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    recruiter = relationship("RecruiterProfile", back_populates="job_postings")
    applications = relationship("JobApplication", back_populates="job")


class JobApplication(Base):
    __tablename__ = "job_applications"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    job_id = Column(String(36), ForeignKey("job_postings.id"))
    student_id = Column(String(36), ForeignKey("student_profiles.id"))
    status = Column(SAEnum(ApplicationStatus), default=ApplicationStatus.APPLIED)
    ai_match_score = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    job = relationship("JobPosting", back_populates="applications")
    student = relationship("StudentProfile", back_populates="applications")

class TargetAudience(enum.Enum):
    STUDENT = "STUDENT"
    TEACHER = "TEACHER"
    BOTH = "BOTH"

class IndustryLearningProgram(Base):
    __tablename__ = "industry_programs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    recruiter_id = Column(String(36), ForeignKey("recruiter_profiles.id"))
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    target_audience = Column(SAEnum(TargetAudience), default=TargetAudience.BOTH)
    url = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    recruiter = relationship("RecruiterProfile")
