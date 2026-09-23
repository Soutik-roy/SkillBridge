from sqlalchemy import Column, String, Boolean, DateTime, Enum as SAEnum
from datetime import datetime
from ..database import Base
import enum
import uuid


class RoleEnum(enum.Enum):
    STUDENT = "STUDENT"
    TEACHER = "TEACHER"
    RECRUITER = "RECRUITER"


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(SAEnum(RoleEnum), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
