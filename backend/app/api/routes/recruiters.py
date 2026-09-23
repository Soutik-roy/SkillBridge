from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..routes.auth import get_current_user
from ...database import get_db
from ...models.user import User, RoleEnum
from ...models.profiles import RecruiterProfile
from pydantic import BaseModel

router = APIRouter(prefix="/recruiters", tags=["Recruiters"])

class RecruiterProfileUpdate(BaseModel):
    company_name: str

class RecruiterProfileOut(BaseModel):
    id: str
    company_name: str
    verification_status: str

    class Config:
        from_attributes = True

@router.get("/profile", response_model=RecruiterProfileOut)
def get_profile(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if user.role != RoleEnum.RECRUITER:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    recruiter = db.query(RecruiterProfile).filter(RecruiterProfile.user_id == user.id).first()
    if not recruiter:
        import uuid
        recruiter = RecruiterProfile(id=str(uuid.uuid4()), user_id=user.id, company_name="Your Company")
        db.add(recruiter)
        db.commit()
        db.refresh(recruiter)
        
    return {
        "id": str(recruiter.id),
        "company_name": recruiter.company_name,
        "verification_status": recruiter.verification_status.value
    }

@router.put("/profile", response_model=RecruiterProfileOut)
def update_profile(data: RecruiterProfileUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if user.role != RoleEnum.RECRUITER:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    recruiter = db.query(RecruiterProfile).filter(RecruiterProfile.user_id == user.id).first()
    if not recruiter:
        import uuid
        recruiter = RecruiterProfile(id=str(uuid.uuid4()), user_id=user.id, company_name=data.company_name)
        db.add(recruiter)
    else:
        recruiter.company_name = data.company_name
        
    db.commit()
    db.refresh(recruiter)
    
    return {
        "id": str(recruiter.id),
        "company_name": recruiter.company_name,
        "verification_status": recruiter.verification_status.value
    }
