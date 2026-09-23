from sqlalchemy import Column, String, ForeignKey, Table
from ..database import Base
import uuid

# Association Tables
student_skills = Table(
    "student_skills",
    Base.metadata,
    Column("student_id", String(36), ForeignKey("student_profiles.id"), primary_key=True),
    Column("skill_id", String(36), ForeignKey("skills.id"), primary_key=True),
)

job_skills = Table(
    "job_skills",
    Base.metadata,
    Column("job_id", String(36), ForeignKey("job_postings.id"), primary_key=True),
    Column("skill_id", String(36), ForeignKey("skills.id"), primary_key=True),
)


class Skill(Base):
    __tablename__ = "skills"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    name = Column(String, unique=True, index=True, nullable=False)
