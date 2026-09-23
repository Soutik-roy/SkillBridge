from sqlalchemy import Column, String, Float, Integer, ForeignKey, DateTime, Text, Enum as SAEnum
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base
import uuid
import enum


class ProficiencyLevel(enum.Enum):
    BEGINNER = "BEGINNER"
    INTERMEDIATE = "INTERMEDIATE"
    ADVANCED = "ADVANCED"
    EXPERT = "EXPERT"


class StudentSkill(Base):
    """A student's self-assessed or evaluated proficiency in a skill."""
    __tablename__ = "student_skill_assessments"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    student_id = Column(String(36), ForeignKey("student_profiles.id"), nullable=False)
    skill_name = Column(String(100), nullable=False)
    proficiency = Column(SAEnum(ProficiencyLevel), default=ProficiencyLevel.BEGINNER)
    score = Column(Float, default=0.0)          # 0-100 deterministic score
    years_experience = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    student = relationship("StudentProfile", back_populates="skill_assessments")


class SkillAssessmentResult(Base):
    """Stores the result of a full skill assessment run."""
    __tablename__ = "skill_assessment_results"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    student_id = Column(String(36), ForeignKey("student_profiles.id"), nullable=False)
    overall_score = Column(Float, default=0.0)    # weighted 0-100
    top_domain = Column(String(100), nullable=True)
    skill_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("StudentProfile")
