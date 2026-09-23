from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Any
import uuid

from ...database import get_db
from ..routes.auth import get_current_user
from ...models.user import User
from ...models.career import CareerPath, Course, Internship
from ...models.job import JobPosting
from ...models.assessment import StudentSkill, SkillAssessmentResult, ProficiencyLevel
from ...schemas.intelligence import (
    SkillAssessmentRequest, SkillAssessmentResponse, GapAnalysisRequest, GapAnalysisResponse,
    RecommendCareersRequest, RecommendCoursesRequest, MatchJobsRequest, RoadmapRequest, RoadmapResponse
)

# Services
from ...services.skill_engine import score_skill, compute_overall_score, get_top_domain
from ...services.gap_engine import analyze_gap
from ...services.recommendation_engine import recommend_careers, recommend_courses, match_jobs, match_internships
from ...services.roadmap_engine import build_roadmap
from ...services.ai_service import get_skill_gap_explanation, get_roadmap_explanation, get_job_match_explanation

router = APIRouter(prefix="/engine", tags=["Core Intelligence"])

def _format_student_skills(skills: List[Any]) -> List[dict]:
    res = []
    for s in skills:
        prof = s.proficiency.name if hasattr(s.proficiency, "name") else str(s.proficiency)
        score = score_skill(s.skill_name, prof, s.years_experience)
        res.append({
            "skill_name": s.skill_name,
            "proficiency": prof,
            "years_experience": s.years_experience,
            "score": score
        })
    return res

@router.post("/assess-skills", response_model=SkillAssessmentResponse)
def assess_skills(req: SkillAssessmentRequest):
    scored = _format_student_skills(req.skills)
    overall = compute_overall_score(scored)
    domain = get_top_domain(scored)
    
    return SkillAssessmentResponse(
        overall_score=overall,
        top_domain=domain,
        scored_skills=scored
    )

@router.post("/skill-gap", response_model=GapAnalysisResponse)
def get_skill_gap(req: GapAnalysisRequest, db: Session = Depends(get_db)):
    career = db.query(CareerPath).filter(CareerPath.id == req.target_career_id).first()
    if not career:
        raise HTTPException(status_code=404, detail="Career not found")
        
    scored = _format_student_skills(req.student_skills)
    gap = analyze_gap(scored, career.required_skills or [])
    
    # Get AI Explanation
    explanation = get_skill_gap_explanation(gap["missing_required"], career.title, gap["match_score"])
    
    return GapAnalysisResponse(
        match_score=gap["match_score"],
        matched_required=gap["matched_required"],
        missing_required=gap["missing_required"],
        matched_preferred=gap["matched_preferred"],
        gap_count=gap["gap_count"],
        strength_count=gap["strength_count"],
        readiness=gap["readiness"],
        ai_explanation=explanation
    )

@router.post("/recommend-careers")
def api_recommend_careers(req: RecommendCareersRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    careers = db.query(CareerPath).all()
    careers_data = [{
        "id": str(c.id), "title": c.title, "domain": c.domain, 
        "required_skills": c.required_skills, "preferred_skills": c.preferred_skills,
        "avg_salary_inr": c.avg_salary_inr, "growth_rate": c.growth_rate
    } for c in careers]
    
    if not req.student_skills:
        from ...models.profiles import StudentProfile
        student = db.query(StudentProfile).filter(StudentProfile.user_id == user.id).first()
        if student:
            req.student_skills = db.query(StudentSkill).filter(StudentSkill.student_id == student.id).all()
            
    scored = _format_student_skills(req.student_skills)
    recs = recommend_careers(scored, careers_data, req.top_n)
    return recs

@router.post("/recommend-courses")
def api_recommend_courses(req: RecommendCoursesRequest, db: Session = Depends(get_db)):
    courses = db.query(Course).all()
    courses_data = [{
        "id": str(c.id), "title": c.title, "provider": c.provider, 
        "skill_name": c.skill_name, "level": c.level, 
        "duration_weeks": c.duration_weeks, "is_free": c.is_free,
        "rating": c.rating, "url": c.url
    } for c in courses]
    
    return recommend_courses(req.missing_skills, courses_data, req.top_n)

@router.post("/match-jobs")
def api_match_jobs(req: MatchJobsRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    from sqlalchemy.orm import joinedload
    jobs = db.query(JobPosting).options(joinedload(JobPosting.recruiter)).filter(JobPosting.is_active == True).all()
    jobs_data = [{
        "id": str(j.id), "title": j.title, "description": j.description,
        "required_skills": j.required_skills or [],
        "company": j.recruiter.company_name if j.recruiter else "Unknown Company"
    } for j in jobs]
    
    if not req.student_skills:
        from ...models.profiles import StudentProfile
        student = db.query(StudentProfile).filter(StudentProfile.user_id == user.id).first()
        if student:
            req.student_skills = db.query(StudentSkill).filter(StudentSkill.student_id == student.id).all()
            
    scored = _format_student_skills(req.student_skills)
    matches = match_jobs(scored, jobs_data, req.top_n)
    
    if matches:
        top_match = matches[0]
        top_match["ai_explanation"] = get_job_match_explanation(
            top_match["title"], top_match["match_score"], 
            top_match["matched_skills"], top_match["missing_skills"]
        )
        
    return matches

@router.post("/match-internships")
def api_match_internships(req: MatchJobsRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    internships = db.query(Internship).filter(Internship.is_active == True).all()
    internships_data = [{
        "id": str(i.id), "title": i.title, "company": i.company,
        "required_skills": i.required_skills, "stipend_monthly": i.stipend_monthly,
        "duration_months": i.duration_months, "is_remote": i.is_remote
    } for i in internships]
    
    if not req.student_skills:
        from ...models.profiles import StudentProfile
        student = db.query(StudentProfile).filter(StudentProfile.user_id == user.id).first()
        if student:
            req.student_skills = db.query(StudentSkill).filter(StudentSkill.student_id == student.id).all()
            
    scored = _format_student_skills(req.student_skills)
    return match_internships(scored, internships_data, req.top_n)

@router.post("/roadmap", response_model=RoadmapResponse)
def api_roadmap(req: RoadmapRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    career = db.query(CareerPath).filter(CareerPath.id == req.target_career_id).first()
    if not career:
        raise HTTPException(status_code=404, detail="Career not found")
        
    courses = db.query(Course).all()
    courses_data = [{
        "id": str(c.id), "title": c.title, "provider": c.provider, 
        "skill_name": c.skill_name, "level": c.level, 
        "duration_weeks": c.duration_weeks, "is_free": c.is_free,
        "rating": c.rating, "url": c.url
    } for c in courses]
    
    career_dict = {
        "id": str(career.id), "title": career.title, "domain": career.domain,
        "required_skills": career.required_skills, "preferred_skills": career.preferred_skills
    }
    
    from ...models.profiles import StudentProfile
    student = db.query(StudentProfile).filter(StudentProfile.user_id == user.id).first()
    
    if not req.student_skills and student:
        req.student_skills = db.query(StudentSkill).filter(StudentSkill.student_id == student.id).all()
        
    scored = _format_student_skills(req.student_skills)
    roadmap = build_roadmap(career_dict, scored, courses_data)
    
    explanation = get_roadmap_explanation(career.title, roadmap["phases"])
    roadmap["ai_explanation"] = explanation
    
    # Save the roadmap to DB
    if student:
        from ...models.career import CareerRoadmap
        new_roadmap = CareerRoadmap(
            student_id=student.id,
            target_career=career.title,
            overall_match_score=roadmap["match_score"],
            phases=roadmap["phases"],
            ai_explanation=explanation
        )
        db.add(new_roadmap)
        db.commit()
    
    return RoadmapResponse(**roadmap)

@router.get("/match-candidates/{job_id}")
def api_match_candidates(job_id: str, top_n: int = 10, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    from ...models.user import RoleEnum
    if user.role != RoleEnum.RECRUITER:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    job = db.query(JobPosting).filter(JobPosting.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    req_skills = job.required_skills or []
    if not req_skills:
        # fallback to heuristic
        req_skills = [] # or we could use _extract_skills_from_text(job.description)
        
    from ...models.profiles import StudentProfile
    students = db.query(StudentProfile).all()
    
    candidates = []
    for student in students:
        skills = db.query(StudentSkill).filter(StudentSkill.student_id == student.id).all()
        scored = _format_student_skills(skills)
        # We can use the existing job match scoring function
        report = analyze_gap(scored, req_skills) 
        # Wait, compute_job_match_score is better but analyze_gap gives detailed gaps
        
        candidates.append({
            "student_id": student.id,
            "name": f"{student.first_name} {student.last_name}",
            "ai_skill_summary": student.ai_skill_summary or "No summary available.",
            "match_score": report["match_score"],
            "matched_skills": report["matched_required"],
            "missing_skills": report["missing_required"]
        })
        
    candidates.sort(key=lambda x: x["match_score"], reverse=True)
    return candidates[:top_n]
