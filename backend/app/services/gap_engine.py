"""
Skill Gap Analysis Engine
--------------------------
Compares a student's assessed skills against a job/career requirement list.
All calculations are deterministic.
"""
from .skill_engine import normalize_skill_name, PROFICIENCY_BASE


def compute_job_match_score(student_skills: list[dict], required_skills: list[str], preferred_skills: list[str] = None) -> dict:
    """
    Returns a detailed match report between student skills and a job's requirements.

    Args:
        student_skills: [{"skill_name": str, "score": float, "proficiency": str}]
        required_skills: list of required skill names
        preferred_skills: list of preferred (bonus) skill names

    Returns:
        {
          "match_score": float (0-100),
          "matched_required": list[str],
          "missing_required": list[str],
          "matched_preferred": list[str],
          "coverage_pct": float,
        }
    """
    preferred_skills = preferred_skills or []
    student_skill_names = {normalize_skill_name(s["skill_name"]) for s in student_skills}
    normalized_required = [normalize_skill_name(r) for r in required_skills]
    normalized_preferred = [normalize_skill_name(p) for p in preferred_skills]

    matched_required = [r for r in normalized_required if r in student_skill_names]
    missing_required = [r for r in normalized_required if r not in student_skill_names]
    matched_preferred = [p for p in normalized_preferred if p in student_skill_names]

    # Core score: % of required skills matched (max 80 pts)
    req_score = (len(matched_required) / len(normalized_required) * 80.0) if normalized_required else 80.0

    # Bonus from preferred (max 20 pts)
    pref_bonus = (len(matched_preferred) / len(normalized_preferred) * 20.0) if normalized_preferred else 0.0

    # Proficiency bonus: if matched required skills are scored high, add up to 5 pts
    matched_scores = [s["score"] for s in student_skills if normalize_skill_name(s["skill_name"]) in set(matched_required)]
    prof_bonus = (sum(matched_scores) / len(matched_scores) / 100.0 * 5.0) if matched_scores else 0.0

    match_score = min(req_score + pref_bonus + prof_bonus, 100.0)
    coverage_pct = round(len(matched_required) / len(normalized_required) * 100, 1) if normalized_required else 100.0

    return {
        "match_score": round(match_score, 2),
        "matched_required": matched_required,
        "missing_required": missing_required,
        "matched_preferred": matched_preferred,
        "coverage_pct": coverage_pct,
    }


def analyze_gap(student_skills: list[dict], required_skills: list[str]) -> dict:
    """
    Returns a structured gap analysis with priority suggestions.
    """
    report = compute_job_match_score(student_skills, required_skills)
    missing = report["missing_required"]
    matched = report["matched_required"]

    # Priority: missing required skills sorted by how common they are in the domain
    high_priority = [s for s in missing if s in ["python", "sql", "javascript", "machine learning", "docker", "aws"]]
    medium_priority = [s for s in missing if s not in high_priority]

    return {
        **report,
        "gap_count": len(missing),
        "high_priority_gaps": high_priority,
        "medium_priority_gaps": medium_priority,
        "strength_count": len(matched),
        "readiness": _classify_readiness(report["match_score"]),
    }


def _classify_readiness(score: float) -> str:
    if score >= 80:
        return "READY"
    elif score >= 60:
        return "NEAR_READY"
    elif score >= 40:
        return "DEVELOPING"
    else:
        return "EARLY_STAGE"
