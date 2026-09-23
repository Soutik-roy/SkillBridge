"""
AI Service Abstraction Layer
----------------------------
Wraps OpenAI API calls with mock fallback when OPENAI_API_KEY is not set.
All AI calls go through this single module — never call openai directly from routes.
"""
import os
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
_client = None

def _get_client():
    global _client
    if _client is None and OPENAI_API_KEY and not OPENAI_API_KEY.startswith("your_"):
        try:
            from openai import OpenAI
            _client = OpenAI(api_key=OPENAI_API_KEY)
        except Exception:
            _client = None
    return _client


def _call_openai(prompt: str, max_tokens: int = 400) -> Optional[str]:
    client = _get_client()
    if not client:
        return None
    try:
        resp = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are SkillBridge AI, a career advisor for Indian students. Be concise, actionable, and encouraging."},
                {"role": "user", "content": prompt},
            ],
            max_tokens=max_tokens,
            temperature=0.7,
        )
        return resp.choices[0].message.content.strip()
    except Exception as e:
        print(f"[AI Service] OpenAI error: {e}")
        return None


# ── Mock responses (deterministic, realistic) ─────────────────────────────────

_MOCK_CAREER_GUIDANCE = (
    "Based on your skill profile, you are well-positioned for a career in software engineering. "
    "Your strongest areas are Python and data analysis. To accelerate growth, focus on system design "
    "and cloud technologies. Set a 6-month goal to complete one production-grade project and obtain "
    "a relevant certification (AWS/GCP). Network actively through LinkedIn and open-source contributions."
)

_MOCK_SKILL_GAP = (
    "Your current skill set covers approximately 60% of the requirements for this role. "
    "The key gaps are: (1) Advanced SQL and database optimization, (2) Docker/Kubernetes containerization, "
    "(3) System design principles. Bridging these gaps will take approximately 3–4 months of dedicated study "
    "at 2 hours per day. Prioritize hands-on projects over theory."
)

_MOCK_ROADMAP = (
    "Your personalized 6-month roadmap: Phase 1 (Month 1–2) — Strengthen fundamentals with DSA and SQL. "
    "Phase 2 (Month 3–4) — Build 2 full-stack projects using React and FastAPI. "
    "Phase 3 (Month 5–6) — Learn cloud deployment (Docker + AWS), contribute to open source, and apply to 10 companies. "
    "Track progress weekly and adjust the plan based on interview feedback."
)

_MOCK_JOB_MATCH = (
    "You are a strong match for this role (82% compatibility). Your Python, FastAPI, and PostgreSQL skills "
    "directly align with the core requirements. The main differentiator will be your project experience — "
    "make sure your resume highlights quantifiable outcomes. Tailor your cover letter to mention the company's "
    "tech stack specifically."
)

_MOCK_INTERVIEW_PREP = (
    "For this role, expect questions in 3 areas: (1) Technical — Data structures, system design, SQL queries. "
    "Practice LeetCode medium problems daily. (2) Behavioral — Use the STAR method for past project stories. "
    "(3) Domain — Research the company's product and be ready to discuss how you'd solve their core problems. "
    "Mock interview tip: Record yourself and review for clarity and confidence."
)


# ── Public API ────────────────────────────────────────────────────────────────

def get_career_guidance(student_skills: list[str], target_career: str) -> str:
    prompt = (
        f"A student has these skills: {', '.join(student_skills)}. "
        f"They want to become a {target_career}. "
        f"Give them 3–4 sentences of specific, actionable career guidance."
    )
    return _call_openai(prompt) or _MOCK_CAREER_GUIDANCE


def get_skill_gap_explanation(missing_skills: list[str], job_title: str, match_score: float) -> str:
    prompt = (
        f"A student has a {match_score:.0f}% match for the role: {job_title}. "
        f"Missing skills: {', '.join(missing_skills) if missing_skills else 'None'}. "
        f"Explain the skill gap in 3–4 sentences and suggest how to close it."
    )
    return _call_openai(prompt) or _MOCK_SKILL_GAP


def get_roadmap_explanation(target_career: str, phases: list[dict]) -> str:
    phase_summary = "; ".join(
        f"Phase {p['phase']}: {p['title']} — {', '.join(p.get('actions', [])[:2])}"
        for p in phases[:3]
    )
    prompt = (
        f"A student wants to become a {target_career}. "
        f"Their roadmap phases: {phase_summary}. "
        f"Write 3–4 sentences explaining why this roadmap is optimal and how to stay motivated."
    )
    return _call_openai(prompt) or _MOCK_ROADMAP


def get_job_match_explanation(job_title: str, match_score: float, matched_skills: list[str], missing_skills: list[str]) -> str:
    prompt = (
        f"A student is a {match_score:.0f}% match for: {job_title}. "
        f"Matched skills: {', '.join(matched_skills[:5])}. "
        f"Missing: {', '.join(missing_skills[:3]) if missing_skills else 'None'}. "
        f"Give 2–3 sentences of actionable advice to improve chances."
    )
    return _call_openai(prompt) or _MOCK_JOB_MATCH


def get_interview_prep(job_title: str, student_skills: list[str]) -> str:
    prompt = (
        f"A student with skills [{', '.join(student_skills[:6])}] is interviewing for: {job_title}. "
        f"Give specific interview preparation advice in 4–5 sentences covering technical, behavioral, and domain areas."
    )
    return _call_openai(prompt) or _MOCK_INTERVIEW_PREP

def generate_quiz_questions(skill_name: str, num_questions: int = 5) -> list[dict]:
    prompt = (
        f"Generate exactly {num_questions} multiple choice questions to assess a user's proficiency in {skill_name}. "
        f"Return ONLY a valid JSON array. Each object in the array must have the following exact schema: "
        f'{{"question": "The question text", "options": {{"a": "option 1", "b": "option 2", "c": "option 3", "d": "option 4"}}, "correct": "a", "explanation": "Why this is correct"}} '
        f"Do not include any markdown formatting, just the raw JSON."
    )
    import json
    response = _call_openai(prompt, max_tokens=1000)
    if response:
        try:
            # Clean up markdown code blocks if the model still outputs them
            if response.startswith("```json"):
                response = response[7:]
            if response.endswith("```"):
                response = response[:-3]
            
            questions = json.loads(response.strip())
            if isinstance(questions, list) and len(questions) > 0:
                return questions
        except Exception as e:
            print(f"[AI Service] Error parsing generated questions: {e}")
            pass
    return None

