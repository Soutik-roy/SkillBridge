"""
Recommendation Engine — Careers, Courses, Jobs, Internships
------------------------------------------------------------
Fully deterministic scoring with ranked output lists.
"""
from .skill_engine import normalize_skill_name, get_skill_domain
from .gap_engine import compute_job_match_score


# ── Career Recommendation ────────────────────────────────────────────────────

def recommend_careers(student_skills: list[dict], all_careers: list[dict], top_n: int = 5) -> list[dict]:
    """
    Ranks career paths by match score.
    Returns top_n careers with match details.
    """
    results = []
    for career in all_careers:
        req = career.get("required_skills") or []
        pref = career.get("preferred_skills") or []
        report = compute_job_match_score(student_skills, req, pref)
        results.append({
            "career_id": career["id"],
            "title": career["title"],
            "domain": career["domain"],
            "match_score": report["match_score"],
            "coverage_pct": report["coverage_pct"],
            "missing_skills": report["missing_required"][:5],
            "avg_salary_inr": career.get("avg_salary_inr", 0),
            "growth_rate": career.get("growth_rate", 0),
        })
    results.sort(key=lambda x: x["match_score"], reverse=True)
    return results[:top_n]


# ── Course Recommendation ────────────────────────────────────────────────────

def recommend_courses(missing_skills: list[str], all_courses: list[dict], top_n: int = 10) -> list[dict]:
    """
    Recommends courses that teach the missing skills.
    Prioritises: skill match → rating → free first.
    """
    if not missing_skills:
        return []
    normalized_missing = {normalize_skill_name(s) for s in missing_skills}
    matched = [
        c for c in all_courses
        if normalize_skill_name(c.get("skill_name", "")) in normalized_missing
    ]
    # Sort: free first, then by rating desc
    matched.sort(key=lambda c: (-int(c.get("is_free", False)), -c.get("rating", 0)))
    return matched[:top_n]


# ── Job Matching ─────────────────────────────────────────────────────────────

def match_jobs(student_skills: list[dict], all_jobs: list[dict], top_n: int = 10) -> list[dict]:
    """
    Scores and ranks active job postings by skill match.
    """
    results = []
    for job in all_jobs:
        if not job.get("is_active", True):
            continue
        # Extract skill names from description heuristically if no structured skills
        req = job.get("required_skills") or _extract_skills_from_text(job.get("description", ""))
        report = compute_job_match_score(student_skills, req)
        results.append({
            "job_id": job["id"],
            "title": job["title"],
            "description": job.get("description", "")[:150] + "...",
            "match_score": report["match_score"],
            "coverage_pct": report["coverage_pct"],
            "matched_skills": report["matched_required"],
            "missing_skills": report["missing_required"][:3],
        })
    results.sort(key=lambda x: x["match_score"], reverse=True)
    return results[:top_n]


# ── Internship Matching ───────────────────────────────────────────────────────

def match_internships(student_skills: list[dict], all_internships: list[dict], top_n: int = 10) -> list[dict]:
    """
    Scores and ranks internships. Lower threshold than jobs (entry-level).
    """
    results = []
    for intern in all_internships:
        if not intern.get("is_active", True):
            continue
        req = intern.get("required_skills") or []
        report = compute_job_match_score(student_skills, req)
        # Internships: give +10 bonus to compensate for fewer required skills
        adjusted_score = min(report["match_score"] + 10, 100.0)
        results.append({
            "internship_id": intern["id"],
            "title": intern["title"],
            "company": intern.get("company", ""),
            "match_score": round(adjusted_score, 2),
            "stipend_monthly": intern.get("stipend_monthly", 0),
            "duration_months": intern.get("duration_months", 2),
            "is_remote": intern.get("is_remote", False),
            "missing_skills": report["missing_required"][:3],
        })
    results.sort(key=lambda x: x["match_score"], reverse=True)
    return results[:top_n]


# ── Helpers ───────────────────────────────────────────────────────────────────

def _extract_skills_from_text(text: str) -> list[str]:
    """Naive keyword extraction from job description."""
    from .skill_engine import SKILL_DOMAIN_MAP
    text_lower = text.lower()
    return [skill for skill in SKILL_DOMAIN_MAP.keys() if skill in text_lower]
