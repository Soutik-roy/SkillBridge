from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..routes.auth import get_current_user
from ...database import get_db
from ...models.user import User
from ...models.profiles import StudentProfile
from ...schemas.schemas import StudentProfileCreate, StudentProfileOut
import uuid

router = APIRouter(prefix="/students", tags=["Students"])


@router.put("/profile", response_model=StudentProfileOut)
def upsert_profile(data: StudentProfileCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user.id).first()
    if profile:
        profile.first_name = data.first_name
        profile.last_name = data.last_name
    else:
        profile = StudentProfile(id=str(uuid.uuid4()), user_id=user.id, **data.model_dump())
        db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


@router.get("/profile", response_model=StudentProfileOut)
def get_profile(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile


@router.get("/dashboard")
def get_dashboard(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    from ...models.assessment import SkillAssessmentResult
    from ...models.job import JobApplication
    from ...models.learning import LessonProgress
    from ...models.career import CareerRoadmap
    from sqlalchemy import func
    
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
        
    # Auto-assign to the first available teacher if unassigned (for MVP testing convenience)
    if not profile.institution_id:
        from ...models.profiles import InstitutionProfile
        first_teacher = db.query(InstitutionProfile).first()
        if first_teacher:
            profile.institution_id = first_teacher.id
            db.commit()
            db.refresh(profile)
        
    # Get overall skill score (average of all latest assessment scores per skill)
    avg_score_res = db.query(func.avg(SkillAssessmentResult.overall_score)).filter(SkillAssessmentResult.student_id == profile.id).scalar()
    avg_score = round(avg_score_res, 1) if avg_score_res else 0.0
    
    # Get applications count
    app_count = db.query(JobApplication).filter(JobApplication.student_id == profile.id).count()
    
    # Get completed courses count (just total completed lessons for now as a proxy, or unique courses)
    # A student has "completed a course" if they finished all its lessons.
    # For now, let's just count unique courses they have interacted with.
    unique_lessons = db.query(LessonProgress).filter(LessonProgress.student_id == profile.id, LessonProgress.completed == True).all()
    completed_lessons_count = len(unique_lessons)
    
    # Get latest roadmap
    roadmap = db.query(CareerRoadmap).filter(CareerRoadmap.student_id == profile.id).order_by(CareerRoadmap.created_at.desc()).first()
    roadmap_data = None
    if roadmap:
        roadmap_data = {
            "target_career": roadmap.target_career,
            "overall_match_score": roadmap.overall_match_score,
            "ai_explanation": roadmap.ai_explanation,
            "phases": roadmap.phases
        }
        
    from ...models.faculty import TeacherAnnouncement, TeacherAssignment
    from ...models.career import Course

    announcements_data = []
    assignments_data = []
    courses_data = []

    if profile.institution_id:
        # Fetch teacher announcements
        announcements = db.query(TeacherAnnouncement)\
                          .filter(TeacherAnnouncement.teacher_id == profile.institution_id)\
                          .order_by(TeacherAnnouncement.created_at.desc())\
                          .limit(3)\
                          .all()
        announcements_data = [{"id": a.id, "title": a.title, "content": a.content, "date": a.created_at} for a in announcements]

        # Fetch teacher assignments
        assignments = db.query(TeacherAssignment)\
                        .filter(TeacherAssignment.teacher_id == profile.institution_id)\
                        .order_by(TeacherAssignment.due_date.asc())\
                        .limit(3)\
                        .all()
        assignments_data = [{"id": a.id, "title": a.title, "due_date": a.due_date, "points": a.total_points} for a in assignments]

        # Fetch teacher courses
        courses = db.query(Course)\
                    .filter(Course.teacher_id == profile.institution_id)\
                    .order_by(Course.created_at.desc())\
                    .limit(3)\
                    .all()
        courses_data = [{"id": c.id, "title": c.title, "skill": c.skill_name, "level": c.level} for c in courses]
        
    from ...models.job import JobPosting
    from ...models.profiles import RecruiterProfile
    
    # Fetch latest 3 active jobs from recruiters
    latest_jobs = db.query(JobPosting, RecruiterProfile)\
                    .join(RecruiterProfile, JobPosting.recruiter_id == RecruiterProfile.id)\
                    .filter(JobPosting.is_active == True)\
                    .order_by(JobPosting.created_at.desc())\
                    .limit(3)\
                    .all()
                    
    latest_jobs_data = []
    for job, recruiter in latest_jobs:
        latest_jobs_data.append({
            "id": job.id,
            "title": job.title,
            "company": recruiter.company_name,
            "created_at": job.created_at
        })

    return {
        "avg_skill_score": avg_score,
        "applications_count": app_count,
        "completed_lessons_count": completed_lessons_count,
        "roadmap": roadmap_data,
        "teacher_announcements": announcements_data,
        "teacher_assignments": assignments_data,
        "teacher_courses": courses_data,
        "latest_jobs": latest_jobs_data
    }

@router.get("/applications")
def get_student_applications(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    from ...models.user import RoleEnum
    if user.role != RoleEnum.STUDENT:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user.id).first()
    if not profile:
        return []
        
    from ...models.job import JobApplication
    apps = db.query(JobApplication.job_id).filter(JobApplication.student_id == profile.id).all()
    return [app.job_id for app in apps]

