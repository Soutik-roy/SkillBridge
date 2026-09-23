from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from ...database import get_db
from ...models.career import Course
from ...models.learning import CourseLesson, LessonProgress
from ...models.profiles import StudentProfile
from ..routes.auth import get_current_user
from ...models.user import User

router = APIRouter(prefix="/courses", tags=["Learning Hub"])


@router.get("")
def list_courses(db: Session = Depends(get_db)):
    courses = db.query(Course).all()
    return [
        {
            "id": str(c.id),
            "title": c.title,
            "skill_name": c.skill_name,
            "level": c.level,
            "duration_weeks": c.duration_weeks,
            "is_free": c.is_free,
            "rating": c.rating,
            "lesson_count": len(c.lessons),
        }
        for c in courses
    ]


@router.get("/{course_id}")
def get_course(course_id: str, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return {
        "id": str(course.id),
        "title": course.title,
        "skill_name": course.skill_name,
        "level": course.level,
        "duration_weeks": course.duration_weeks,
        "is_free": course.is_free,
        "rating": course.rating,
        "lessons": [
            {"id": str(l.id), "order": l.order, "title": l.title,
             "duration_mins": l.duration_mins, "content": l.content}
            for l in course.lessons
        ],
    }


@router.get("/{course_id}/progress")
def get_progress(course_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    student = db.query(StudentProfile).filter(StudentProfile.user_id == user.id).first()
    # Return empty progress if student profile doesn't exist yet (no error)
    if not student:
        return {"total_lessons": 0, "completed_count": 0, "completion_pct": 0, "completed_lesson_ids": []}

    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    total = len(course.lessons)
    lesson_ids = [l.id for l in course.lessons]
    completed_records = db.query(LessonProgress).filter(
        LessonProgress.student_id == student.id,
        LessonProgress.lesson_id.in_(lesson_ids),
        LessonProgress.completed == True
    ).all()
    completed_ids = [str(r.lesson_id) for r in completed_records]
    return {
        "total_lessons": total,
        "completed_count": len(completed_ids),
        "completion_pct": round(len(completed_ids) / total * 100) if total else 0,
        "completed_lesson_ids": completed_ids,
    }


@router.post("/{course_id}/lessons/{lesson_id}/complete")
def complete_lesson(course_id: str, lesson_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    student = db.query(StudentProfile).filter(StudentProfile.user_id == user.id).first()
    if not student:
        raise HTTPException(status_code=403, detail="Student profile required")
    lesson = db.query(CourseLesson).filter(
        CourseLesson.id == lesson_id, CourseLesson.course_id == course_id
    ).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    existing = db.query(LessonProgress).filter(
        LessonProgress.student_id == student.id,
        LessonProgress.lesson_id == lesson_id
    ).first()
    if existing:
        existing.completed = True
        existing.completed_at = datetime.utcnow()
    else:
        db.add(LessonProgress(
            student_id=student.id, lesson_id=lesson_id,
            completed=True, completed_at=datetime.utcnow()
        ))
    db.commit()
    return {"message": "Lesson completed ✅"}
