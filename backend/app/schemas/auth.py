from pydantic import BaseModel, EmailStr
from enum import Enum


class RoleEnum(str, Enum):
    STUDENT = "STUDENT"
    TEACHER = "TEACHER"
    RECRUITER = "RECRUITER"


# ── Auth Schemas ──────────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    role: RoleEnum


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    id: str
    email: str
    role: RoleEnum
    is_active: bool

    class Config:
        from_attributes = True
