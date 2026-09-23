from sqlalchemy import Column, String, ForeignKey, Enum as SAEnum, Text
from sqlalchemy.orm import relationship
from ..database import Base
import enum
import uuid


class VerificationStatus(enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String(36), ForeignKey("users.id"))
    institution_id = Column(String(36), ForeignKey("institution_profiles.id"), nullable=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    resume_url = Column(String, nullable=True)
    ai_skill_summary = Column(Text, nullable=True)

    user = relationship("User")
    institution = relationship("InstitutionProfile", back_populates="students")
    applications = relationship("JobApplication", back_populates="student")
    skill_assessments = relationship("StudentSkill", back_populates="student")


class InstitutionProfile(Base):
    __tablename__ = "institution_profiles"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String(36), ForeignKey("users.id"))
    name = Column(String, nullable=False)
    verification_status = Column(SAEnum(VerificationStatus), default=VerificationStatus.PENDING)
    contact_email = Column(String, nullable=True)

    user = relationship("User")
    students = relationship("StudentProfile", back_populates="institution")


class RecruiterProfile(Base):
    __tablename__ = "recruiter_profiles"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String(36), ForeignKey("users.id"))
    company_name = Column(String, nullable=False)
    verification_status = Column(SAEnum(VerificationStatus), default=VerificationStatus.PENDING)

    user = relationship("User")
    job_postings = relationship("JobPosting", back_populates="recruiter")
