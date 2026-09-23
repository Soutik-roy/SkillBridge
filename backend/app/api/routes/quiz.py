from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List
from sqlalchemy.orm import Session
from ...services.quiz_engine import get_questions, evaluate_answers, AVAILABLE_SKILLS
from ...services.recommendation_engine import recommend_courses
from ...services.ai_service import get_skill_gap_explanation
from ...database import get_db, SessionLocal
from ...models.career import Course
from ...models.user import User
from ...models.profiles import StudentProfile
from ...models.assessment import StudentSkill, ProficiencyLevel
from ..routes.auth import get_current_user
import uuid

router = APIRouter(prefix="/quiz", tags=["Skill Quiz"])

class StartQuizRequest(BaseModel):
    skill_name: str

class SubmitQuizRequest(BaseModel):
    session_id: str
    answers: List[str]

@router.get("/skills")
def list_skills():
    return {"skills": AVAILABLE_SKILLS}

@router.post("/start")
def start_quiz(req: StartQuizRequest):
    session_id, questions = get_questions(req.skill_name)
    if not questions:
        return {"error": f"No questions found for '{req.skill_name}'", "available_skills": AVAILABLE_SKILLS}
    return {"skill": req.skill_name, "session_id": session_id, "total_questions": len(questions), "questions": questions}

@router.post("/submit")
def submit_quiz(req: SubmitQuizRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    result = evaluate_answers(req.session_id, req.answers)
    
    # Extract evaluated skill name from result
    skill_name = result.get("skill")
    if not skill_name:
        raise HTTPException(status_code=400, detail="Invalid or expired session ID")
    
    student = db.query(StudentProfile).filter(StudentProfile.user_id == user.id).first()
    if student:
        existing_skill = db.query(StudentSkill).filter(
            StudentSkill.student_id == student.id, 
            StudentSkill.skill_name == skill_name
        ).first()
        
        prof_enum = getattr(ProficiencyLevel, result["proficiency"], ProficiencyLevel.BEGINNER)
        if existing_skill:
            existing_skill.score = result["score"]
            existing_skill.proficiency = prof_enum
        else:
            new_skill = StudentSkill(
                id=str(uuid.uuid4()),
                student_id=student.id,
                skill_name=skill_name,
                score=result["score"],
                proficiency=prof_enum
            )
            db.add(new_skill)
        
        # Upsert a dummy overall assessment result for dashboard average query
        from ...models.assessment import SkillAssessmentResult
        sar = db.query(SkillAssessmentResult).filter(SkillAssessmentResult.student_id == student.id).first()
        if not sar:
            sar = SkillAssessmentResult(id=str(uuid.uuid4()), student_id=student.id, overall_score=result["score"])
            db.add(sar)
        else:
            sar.overall_score = result["score"] # MVP simplify
        
        db.commit()

    courses = db.query(Course).all()
    courses_data = [{
        "id": str(c.id), "title": c.title, "provider": c.provider,
        "skill_name": c.skill_name, "level": c.level,
        "duration_weeks": c.duration_weeks, "is_free": c.is_free,
        "rating": c.rating, "url": c.url
    } for c in courses]

    # Recommend courses for this skill based on level
    recommended = recommend_courses([skill_name], courses_data, top_n=3)

    # AI-generated feedback based on score
    proficiency = result["proficiency"]
    score = result["score"]

    if score == 100:
        ai_feedback = (
            f"Outstanding! You scored 100% on {skill_name.title()}. "
            "You have expert-level mastery. Consider building open-source projects or mentoring others. "
            "Explore advanced certifications to formalize your expertise."
        )
    elif proficiency == "ADVANCED":
        ai_feedback = (
            f"Great work! You scored {score}% on {skill_name.title()} — you're at an advanced level. "
            "Focus on real-world projects and system design to reach expert level. "
            "A certification in this domain would strongly boost your profile."
        )
    elif proficiency == "INTERMEDIATE":
        ai_feedback = (
            f"Good foundation! You scored {score}% on {skill_name.title()}. "
            "You understand the basics but have gaps in depth. "
            "Complete the recommended courses below and build 1 portfolio project using this skill."
        )
    else:
        ai_feedback = (
            f"You scored {score}% on {skill_name.title()} — you're at beginner level. "
            "Don't worry! Start with the free courses below and practice consistently. "
            "30 minutes of daily practice for 30 days will move you to intermediate level."
        )

    return {
        **result,
        "skill": skill_name,
        "ai_feedback": ai_feedback,
        "recommended_courses": recommended,
    }
