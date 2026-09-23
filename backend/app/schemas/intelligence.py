from pydantic import BaseModel
from typing import List, Dict, Any, Optional

# Assessment Schemas
class SkillInput(BaseModel):
    skill_name: str
    proficiency: str
    years_experience: float = 0.0

class SkillAssessmentRequest(BaseModel):
    skills: List[SkillInput]

class SkillAssessmentResponse(BaseModel):
    overall_score: float
    top_domain: str
    scored_skills: List[Dict[str, Any]]

# Gap Analysis Schemas
class GapAnalysisRequest(BaseModel):
    student_skills: List[SkillInput]
    target_career_id: str

class GapAnalysisResponse(BaseModel):
    match_score: float
    matched_required: List[str]
    missing_required: List[str]
    matched_preferred: List[str]
    gap_count: int
    strength_count: int
    readiness: str
    ai_explanation: str

# Recommendation Schemas
# Recommendation Schemas
class RecommendCareersRequest(BaseModel):
    student_skills: Optional[List[SkillInput]] = []
    top_n: int = 5

class RecommendCoursesRequest(BaseModel):
    missing_skills: List[str]
    top_n: int = 10

class MatchJobsRequest(BaseModel):
    student_skills: Optional[List[SkillInput]] = []
    top_n: int = 10

# Roadmap Schema
class RoadmapRequest(BaseModel):
    student_skills: Optional[List[SkillInput]] = []
    target_career_id: str

class RoadmapResponse(BaseModel):
    target_career: str
    match_score: float
    readiness: str
    phases: List[Dict[str, Any]]
    total_weeks: int
    ai_explanation: str
