from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from ...database import get_db
from ..routes.auth import get_current_user
from ...models.user import User, RoleEnum
from ...models.faculty import FacultyOpportunity
from ...models.profiles import InstitutionProfile, StudentProfile

router = APIRouter(prefix="/faculty", tags=["Faculty"])

def _get_or_create_teacher_profile(db: Session, current_user: User):
    teacher_profile = db.query(InstitutionProfile).filter(InstitutionProfile.user_id == current_user.id).first()
    if not teacher_profile:
        import uuid
        teacher_profile = InstitutionProfile(id=str(uuid.uuid4()), user_id=current_user.id, name="Teacher")
        db.add(teacher_profile)
        db.commit()
        db.refresh(teacher_profile)
    return teacher_profile

def _claim_unassigned_students(db: Session, teacher_id: str):
    from ...models.profiles import StudentProfile
    unassigned = db.query(StudentProfile).filter(StudentProfile.institution_id == None).all()
    if unassigned:
        for u in unassigned:
            u.institution_id = teacher_id
        db.commit()

def _seed_faculty_opportunities_if_empty(db: Session):
    if db.query(FacultyOpportunity).count() > 0:
        return
    
    seeds = [
        FacultyOpportunity(type="Faculty Internship", title="Industry Immersion — Data Engineering", company="DataSphere Technologies", location="Hybrid", duration="8 weeks", focus_skills="Data Engineering, SQL, Cloud"),
        FacultyOpportunity(type="Faculty Internship", title="AI in Healthcare Faculty Program", company="MediTech Labs", location="Bengaluru", duration="4 weeks", focus_skills="AI/ML, Healthcare Analytics"),
        FacultyOpportunity(type="FDP", title="Advanced Cloud Architecture FDP", company="AWS EdStart", location="Remote", duration="2 weeks", focus_skills="AWS, Cloud Native"),
        FacultyOpportunity(type="Consultancy", title="Scalable E-commerce Backend", company="RetailGenix", location="Remote", duration="3 months", focus_skills="Node.js, Microservices"),
        FacultyOpportunity(type="Research", title="Quantum Cryptography in IoT", company="GovTech Institute", location="Hybrid", duration="6 months", focus_skills="Quantum, IoT Security"),
        FacultyOpportunity(type="Mentorship", title="Senior Dev Mentor Circle", company="Tech Startup Hub", location="Remote", duration="Ongoing", focus_skills="Leadership, React, Python")
    ]
    db.add_all(seeds)
    db.commit()

@router.get("/dashboard-metrics")
def get_faculty_dashboard(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != RoleEnum.TEACHER:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Auto-create profile if missing (backward compatibility fix)
    teacher_profile = _get_or_create_teacher_profile(db, current_user)
    _claim_unassigned_students(db, teacher_profile.id)
    
    _seed_faculty_opportunities_if_empty(db)
        
    from ...models.profiles import StudentProfile
    from ...models.career import Course
    from ...models.faculty import TeacherAssignment, TeacherAnnouncement
    
    student_count = db.query(StudentProfile).filter(StudentProfile.institution_id == teacher_profile.id).count()
    course_count = db.query(Course).filter(Course.teacher_id == teacher_profile.id).count()
    assignment_count = db.query(TeacherAssignment).filter(TeacherAssignment.teacher_id == teacher_profile.id).count()
    announcement_count = db.query(TeacherAnnouncement).filter(TeacherAnnouncement.teacher_id == teacher_profile.id).count()

    metrics = {
        "total_students": student_count,
        "active_courses": course_count,
        "assignments_posted": assignment_count,
        "announcements_sent": announcement_count
    }
    
    # Get recommended opportunities (just get some random active ones for now)
    opps_db = db.query(FacultyOpportunity).filter(FacultyOpportunity.is_active == True).limit(5).all()
    opportunities = []
    for op in opps_db:
        opportunities.append({
            "id": op.id,
            "type": op.type,
            "title": op.title,
            "company": op.company,
            "location": op.location,
            "duration": op.duration,
            "skills": op.focus_skills,
        })
    
    # Calculate real readiness scores from actual teacher activity
    readiness_scores = [
        {"name": "Industry Engagement", "score": min(100, announcement_count * 10 + 40)},
        {"name": "Research Profile", "score": min(100, assignment_count * 5 + 50)},
        {"name": "Digital Skills", "score": min(100, course_count * 15 + 60)},
        {"name": "Mentorship Activity", "score": min(100, student_count * 5 + 30)}
    ]
    
    return {
        "metrics": metrics,
        "opportunities": opportunities,
        "readiness": readiness_scores
    }

@router.get("/opportunities")
def get_faculty_opportunities(type: str = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Fetch opportunities filtered by type."""
    if current_user.role != RoleEnum.TEACHER:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    query = db.query(FacultyOpportunity).filter(FacultyOpportunity.is_active == True)
    if type:
        query = query.filter(FacultyOpportunity.type == type)
        
    return query.all()

@router.get("/students")
def get_faculty_students(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Fetch students linked to this teacher/institution."""
    if current_user.role != RoleEnum.TEACHER:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Get the teacher's profile
    teacher_profile = _get_or_create_teacher_profile(db, current_user)
    _claim_unassigned_students(db, teacher_profile.id)
        
    students = db.query(StudentProfile).filter(StudentProfile.institution_id == teacher_profile.id).all()

    # Format the response
    result = []
    for s in students:
        from ...models.assessment import StudentSkill, SkillAssessmentResult
        skills = db.query(StudentSkill).filter(StudentSkill.student_id == s.id).all()
        skill_tags = [sk.skill_name for sk in skills] if skills else []
        
        # Calculate real progress from assessments
        assessments = db.query(SkillAssessmentResult).filter(SkillAssessmentResult.student_id == s.id).all()
        if assessments:
            avg_score = sum([a.overall_score for a in assessments]) / len(assessments)
        else:
            avg_score = 0
            
        progress = int(avg_score)
        if progress >= 80:
            status = "Excelling"
        elif progress >= 50:
            status = "On Track"
        else:
            status = "Needs Attention"

        result.append({
            "id": s.id,
            "name": f"{s.first_name} {s.last_name}",
            "email": s.user.email,
            "skills": skill_tags[:3],
            "progress": progress,
            "status": status
        })
        
    return result

@router.get("/courses")
def get_faculty_courses(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Fetch courses created/managed by this teacher."""
    if current_user.role != RoleEnum.TEACHER:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    teacher_profile = _get_or_create_teacher_profile(db, current_user)
        
    from ...models.career import Course
    
    courses = db.query(Course).filter(Course.teacher_id == teacher_profile.id).all()
    
    # We will build a list of dicts to inject the real 'enrolled_count'
    # Since we don't have an explicit Enrollment table yet, we can check 
    # how many unique students have LessonProgress for this course's lessons.
    from ...models.learning import LessonProgress, CourseLesson
    
    result = []
    for c in courses:
        # Count unique students who interacted with any lesson in this course
        enrolled = db.query(LessonProgress.student_id)\
                     .join(CourseLesson, CourseLesson.id == LessonProgress.lesson_id)\
                     .filter(CourseLesson.course_id == c.id)\
                     .distinct().count()
        
        result.append({
            "id": c.id,
            "title": c.title,
            "skill_name": c.skill_name,
            "level": c.level,
            "duration_weeks": c.duration_weeks,
            "is_free": c.is_free,
            "enrolled_count": enrolled
        })
        
    return result

from pydantic import BaseModel

class CourseCreateRequest(BaseModel):
    title: str
    skill_name: str
    level: str
    duration_weeks: int
    is_free: bool

@router.post("/courses")
def create_faculty_course(req: CourseCreateRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != RoleEnum.TEACHER:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    teacher_profile = _get_or_create_teacher_profile(db, current_user)
        
    from ...models.career import Course
    new_course = Course(
        title=req.title,
        provider=current_user.email.split('@')[0], # Basic provider name
        teacher_id=teacher_profile.id,
        skill_name=req.skill_name,
        level=req.level,
        duration_weeks=req.duration_weeks,
        is_free=req.is_free
    )
    db.add(new_course)
    db.commit()
    db.refresh(new_course)
    return new_course

class AnnouncementCreateRequest(BaseModel):
    title: str
    content: str

@router.get("/announcements")
def get_faculty_announcements(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != RoleEnum.TEACHER:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    teacher_profile = _get_or_create_teacher_profile(db, current_user)
    
    from ...models.faculty import TeacherAnnouncement
    announcements = db.query(TeacherAnnouncement).filter(TeacherAnnouncement.teacher_id == teacher_profile.id).order_by(TeacherAnnouncement.created_at.desc()).all()
    
    return announcements

@router.post("/announcements")
def create_faculty_announcement(req: AnnouncementCreateRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != RoleEnum.TEACHER:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    teacher_profile = _get_or_create_teacher_profile(db, current_user)
    
    from ...models.faculty import TeacherAnnouncement
    ann = TeacherAnnouncement(
        teacher_id=teacher_profile.id,
        title=req.title,
        content=req.content
    )
    db.add(ann)
    db.commit()
    db.refresh(ann)
    return ann

from datetime import datetime

class AssignmentCreateRequest(BaseModel):
    title: str
    description: str
    due_date: str
    total_points: int

@router.get("/assignments")
def get_faculty_assignments(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != RoleEnum.TEACHER:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    teacher_profile = _get_or_create_teacher_profile(db, current_user)
    
    from ...models.faculty import TeacherAssignment
    from ...models.profiles import StudentProfile
    
    assignments = db.query(TeacherAssignment).filter(TeacherAssignment.teacher_id == teacher_profile.id).order_by(TeacherAssignment.due_date.asc()).all()
    total_students = db.query(StudentProfile).filter(StudentProfile.institution_id == teacher_profile.id).count()
    
    return {
        "assignments": assignments,
        "total_students": total_students
    }

@router.post("/assignments")
def create_faculty_assignment(req: AssignmentCreateRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != RoleEnum.TEACHER:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    teacher_profile = _get_or_create_teacher_profile(db, current_user)
    
    from ...models.faculty import TeacherAssignment
    
    try:
        parsed_date = datetime.strptime(req.due_date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
        
    assignment = TeacherAssignment(
        teacher_id=teacher_profile.id,
        title=req.title,
        description=req.description,
        due_date=parsed_date,
        total_points=req.total_points
    )
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return assignment
