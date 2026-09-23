from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..routes.auth import get_current_user
from ...database import get_db
from ...models.user import User
from ...models.profiles import RecruiterProfile
from ...models.job import JobPosting, JobApplication, ApplicationStatus
from ...schemas.schemas import JobCreate, JobOut, ApplicationOut
import uuid

router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.get("/dashboard-metrics")
def get_recruiter_dashboard(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    from ...models.user import RoleEnum
    if user.role != RoleEnum.RECRUITER:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    recruiter = db.query(RecruiterProfile).filter(RecruiterProfile.user_id == user.id).first()
    if not recruiter:
        import uuid
        recruiter = RecruiterProfile(id=str(uuid.uuid4()), user_id=user.id, company_name="Your Company")
        db.add(recruiter)
        db.commit()
        db.refresh(recruiter)
        
    jobs = db.query(JobPosting).filter(JobPosting.recruiter_id == recruiter.id).all()
    job_ids = [j.id for j in jobs]
    
    active_jobs = len([j for j in jobs if j.is_active])
    
    apps = db.query(JobApplication).filter(JobApplication.job_id.in_(job_ids)).all() if job_ids else []
    total_apps = len(apps)
    
    shortlisted = len([a for a in apps if a.status == ApplicationStatus.SHORTLISTED])
    interviews = len([a for a in apps if a.status == ApplicationStatus.INTERVIEW])
    
    # recent applications
    from ...models.profiles import StudentProfile
    recent = db.query(JobApplication, JobPosting, StudentProfile)\
        .join(JobPosting, JobApplication.job_id == JobPosting.id)\
        .join(StudentProfile, JobApplication.student_id == StudentProfile.id)\
        .filter(JobPosting.recruiter_id == recruiter.id)\
        .order_by(JobApplication.created_at.desc())\
        .limit(3)\
        .all()
        
    recent_data = []
    for app, job, student in recent:
        recent_data.append({
            "candidate_name": f"{student.first_name} {student.last_name}",
            "position": job.title,
            "applied_date": app.created_at,
            "status": app.status.value
        })
        
    # upcoming interviews
    upcoming = db.query(JobApplication, JobPosting, StudentProfile)\
        .join(JobPosting, JobApplication.job_id == JobPosting.id)\
        .join(StudentProfile, JobApplication.student_id == StudentProfile.id)\
        .filter(JobPosting.recruiter_id == recruiter.id, JobApplication.status == ApplicationStatus.INTERVIEW)\
        .order_by(JobApplication.created_at.desc())\
        .limit(3)\
        .all()
        
    upcoming_data = []
    for app, job, student in upcoming:
        upcoming_data.append({
            "candidate_name": f"{student.first_name} {student.last_name}",
            # We don't have an interview date in the schema, so we'll just show 'Pending Scheduling' or a fake relative date based on created_at for MVP
            "time": "Pending Scheduling"
        })
        
    return {
        "active_jobs": active_jobs,
        "applications": total_apps,
        "shortlisted": shortlisted,
        "interviews": interviews,
        "recent_applications": recent_data,
        "upcoming_interviews": upcoming_data
    }


@router.post("", response_model=JobOut, status_code=201)
def create_job(data: JobCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    recruiter = db.query(RecruiterProfile).filter(RecruiterProfile.user_id == user.id).first()
    if not recruiter:
        recruiter = RecruiterProfile(id=str(uuid.uuid4()), user_id=user.id, company_name="Your Company")
        db.add(recruiter)
        db.commit()
        db.refresh(recruiter)
        
    job = JobPosting(id=str(uuid.uuid4()), recruiter_id=recruiter.id, **data.model_dump())
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


@router.get("", response_model=List[JobOut])
def list_jobs(db: Session = Depends(get_db)):
    return db.query(JobPosting).filter(JobPosting.is_active == True).all()


@router.get("/recruiter/me", response_model=List[JobOut])
def get_recruiter_jobs(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    from ...models.user import RoleEnum
    if user.role != RoleEnum.RECRUITER:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    recruiter = db.query(RecruiterProfile).filter(RecruiterProfile.user_id == user.id).first()
    if not recruiter:
        return []
    
    return db.query(JobPosting).filter(JobPosting.recruiter_id == recruiter.id).all()


@router.get("/recruiter/applications")
def get_recruiter_applications(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    from ...models.user import RoleEnum
    if user.role != RoleEnum.RECRUITER:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    recruiter = db.query(RecruiterProfile).filter(RecruiterProfile.user_id == user.id).first()
    if not recruiter:
        return []
        
    from ...models.profiles import StudentProfile
    
    apps = db.query(JobApplication, JobPosting, StudentProfile, User)\
        .join(JobPosting, JobApplication.job_id == JobPosting.id)\
        .join(StudentProfile, JobApplication.student_id == StudentProfile.id)\
        .join(User, StudentProfile.user_id == User.id)\
        .filter(JobPosting.recruiter_id == recruiter.id)\
        .order_by(JobApplication.created_at.desc())\
        .all()
        
    result = []
    for app, job, student, candidate_user in apps:
        result.append({
            "id": app.id,
            "student_id": student.id,
            "candidate_name": f"{student.first_name} {student.last_name}",
            "candidate_email": candidate_user.email,
            "job_title": job.title,
            "job_id": job.id,
            "status": app.status.value,
            "ai_match_score": app.ai_match_score or 0,
            "applied_date": app.created_at
        })
    return result


from ...schemas.schemas import IndustryProgramCreate, IndustryProgramOut, TargetAudienceEnum
from ...models.job import IndustryLearningProgram, TargetAudience

@router.post("/programs", response_model=IndustryProgramOut, status_code=201)
def create_program(data: IndustryProgramCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    from ...models.user import RoleEnum
    if user.role != RoleEnum.RECRUITER:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    recruiter = db.query(RecruiterProfile).filter(RecruiterProfile.user_id == user.id).first()
    if not recruiter:
        recruiter = RecruiterProfile(id=str(uuid.uuid4()), user_id=user.id, company_name="Your Company")
        db.add(recruiter)
        db.commit()
        db.refresh(recruiter)
        
    program = IndustryLearningProgram(
        id=str(uuid.uuid4()), 
        recruiter_id=recruiter.id, 
        title=data.title,
        description=data.description,
        target_audience=TargetAudience(data.target_audience.value),
        url=data.url
    )
    db.add(program)
    db.commit()
    db.refresh(program)
    return program

@router.get("/recruiter/programs", response_model=List[IndustryProgramOut])
def get_recruiter_programs(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    from ...models.user import RoleEnum
    if user.role != RoleEnum.RECRUITER:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    recruiter = db.query(RecruiterProfile).filter(RecruiterProfile.user_id == user.id).first()
    if not recruiter:
        return []
    
    return db.query(IndustryLearningProgram).filter(IndustryLearningProgram.recruiter_id == recruiter.id).all()

@router.get("/programs", response_model=List[IndustryProgramOut])
def list_programs(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    from ...models.user import RoleEnum
    query = db.query(IndustryLearningProgram).filter(IndustryLearningProgram.is_active == True)
    
    if user.role == RoleEnum.STUDENT:
        query = query.filter(IndustryLearningProgram.target_audience.in_([TargetAudience.STUDENT, TargetAudience.BOTH]))
    elif user.role == RoleEnum.TEACHER:
        query = query.filter(IndustryLearningProgram.target_audience.in_([TargetAudience.TEACHER, TargetAudience.BOTH]))
        
    return query.all()


@router.get("/{job_id}", response_model=JobOut)
def get_job(job_id: str, db: Session = Depends(get_db)):
    job = db.query(JobPosting).filter(JobPosting.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@router.post("/{job_id}/apply", response_model=ApplicationOut, status_code=201)
def apply_to_job(job_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    from ...models.profiles import StudentProfile
    student = db.query(StudentProfile).filter(StudentProfile.user_id == user.id).first()
    if not student:
        raise HTTPException(status_code=403, detail="Student profile required")
    existing = db.query(JobApplication).filter(
        JobApplication.job_id == job_id,
        JobApplication.student_id == student.id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already applied")
    app = JobApplication(id=str(uuid.uuid4()), job_id=job_id, student_id=student.id)
    db.add(app)
    db.commit()
    db.refresh(app)
    return app


@router.put("/{job_id}", response_model=JobOut)
def update_job(job_id: str, is_active: bool, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    job = db.query(JobPosting).filter(JobPosting.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    recruiter = db.query(RecruiterProfile).filter(RecruiterProfile.user_id == user.id).first()
    if not recruiter or job.recruiter_id != recruiter.id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this job")
        
    job.is_active = is_active
    db.commit()
    db.refresh(job)
    return job

@router.put("/applications/{app_id}/status")
def update_application_status(app_id: str, status: ApplicationStatus, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    from ...models.user import RoleEnum
    if user.role != RoleEnum.RECRUITER:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    recruiter = db.query(RecruiterProfile).filter(RecruiterProfile.user_id == user.id).first()
    app = db.query(JobApplication).filter(JobApplication.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
        
    job = db.query(JobPosting).filter(JobPosting.id == app.job_id).first()
    if not job or job.recruiter_id != recruiter.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    app.status = status
    db.commit()
    return {"message": "Status updated successfully", "status": app.status.value}


