from sqlalchemy import Column, String, Integer, Text, Boolean, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base
import uuid

class FacultyOpportunity(Base):
    """Stores all types of faculty opportunities: Internships, FDPs, Consultancy, Research, Mentorship."""
    __tablename__ = "faculty_opportunities"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    type = Column(String(50), nullable=False, index=True) # "Faculty Internship", "FDP", "Consultancy", "Research", "Mentorship"
    title = Column(String(200), nullable=False)
    company = Column(String(200), nullable=False) # Or "Institution / Organization"
    location = Column(String(100), nullable=True)
    duration = Column(String(50), nullable=True)
    description = Column(Text, nullable=True)
    focus_skills = Column(String(500), nullable=True) # Comma separated
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class TeacherApplication(Base):
    """Tracks when a teacher applies for a FacultyOpportunity."""
    __tablename__ = "teacher_applications"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    teacher_id = Column(String(36), ForeignKey("institution_profiles.id"), nullable=False)
    opportunity_id = Column(String(36), ForeignKey("faculty_opportunities.id"), nullable=False)
    status = Column(String(50), default="Applied") # Applied, Accepted, Rejected
    created_at = Column(DateTime, default=datetime.utcnow)
    
    teacher = relationship("InstitutionProfile")
    opportunity = relationship("FacultyOpportunity")

class TeacherAnnouncement(Base):
    """Announcements posted by teachers for their students."""
    __tablename__ = "teacher_announcements"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    teacher_id = Column(String(36), ForeignKey("institution_profiles.id"), nullable=False)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    teacher = relationship("InstitutionProfile")

class TeacherAssignment(Base):
    """Assignments posted by teachers for their students."""
    __tablename__ = "teacher_assignments"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    teacher_id = Column(String(36), ForeignKey("institution_profiles.id"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    due_date = Column(DateTime, nullable=True)
    total_points = Column(Integer, default=100)
    created_at = Column(DateTime, default=datetime.utcnow)

    teacher = relationship("InstitutionProfile")
