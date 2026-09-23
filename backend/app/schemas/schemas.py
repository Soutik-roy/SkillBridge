from pydantic import BaseModel
from typing import Optional
from enum import Enum


class VerificationStatus(str, Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"


class ApplicationStatus(str, Enum):
    APPLIED = "APPLIED"
    REVIEWING = "REVIEWING"
    SHORTLISTED = "SHORTLISTED"
    INTERVIEW = "INTERVIEW"
    ACCEPTED = "ACCEPTED"
    REJECTED = "REJECTED"


# ── Student ───────────────────────────────────────────────────────────────────

class StudentProfileCreate(BaseModel):
    first_name: str
    last_name: str


class StudentProfileOut(BaseModel):
    id: str
    first_name: str
    last_name: str
    resume_url: Optional[str] = None
    ai_skill_summary: Optional[str] = None

    class Config:
        from_attributes = True


# ── Job ───────────────────────────────────────────────────────────────────────

class JobCreate(BaseModel):
    title: str
    description: str
    required_skills: Optional[list[str]] = None


class JobOut(BaseModel):
    id: str
    title: str
    description: str
    required_skills: Optional[list[str]] = None
    is_active: bool

    class Config:
        from_attributes = True


class ApplicationOut(BaseModel):
    id: str
    job_id: str
    student_id: str
    status: ApplicationStatus
    ai_match_score: Optional[float] = None

    class Config:
        from_attributes = True

class TargetAudienceEnum(str, Enum):
    STUDENT = "STUDENT"
    TEACHER = "TEACHER"
    BOTH = "BOTH"

class IndustryProgramCreate(BaseModel):
    title: str
    description: str
    target_audience: TargetAudienceEnum
    url: Optional[str] = None

class IndustryProgramOut(BaseModel):
    id: str
    title: str
    description: str
    target_audience: TargetAudienceEnum
    url: Optional[str] = None
    is_active: bool

    class Config:
        from_attributes = True
