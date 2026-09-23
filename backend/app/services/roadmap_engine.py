"""
Career Roadmap Generator
-------------------------
Builds a personalised, phased roadmap for a student targeting a career.
Fully deterministic — no randomness.
"""
from .gap_engine import analyze_gap
from .recommendation_engine import recommend_courses


def build_roadmap(
    target_career: dict,
    student_skills: list[dict],
    all_courses: list[dict],
) -> dict:
    """
    Builds a 3-phase career roadmap.

    Returns:
        {
          "target_career": str,
          "match_score": float,
          "readiness": str,
          "phases": list[phase_dict],
          "total_weeks": int,
        }
    """
    req = target_career.get("required_skills") or []
    pref = target_career.get("preferred_skills") or []
    gap = analyze_gap(student_skills, req)

    # Courses for missing required skills
    gap_courses = recommend_courses(gap["missing_required"], all_courses, top_n=6)
    # Courses for preferred skills gap
    pref_missing = [p for p in pref if p not in gap["matched_required"]]
    pref_courses = recommend_courses(pref_missing, all_courses, top_n=3)

    phases = _generate_phases(gap, gap_courses, pref_courses, target_career)

    total_weeks = sum(p.get("duration_weeks", 4) for p in phases)

    return {
        "target_career": target_career["title"],
        "match_score": gap["match_score"],
        "readiness": gap["readiness"],
        "phases": phases,
        "total_weeks": total_weeks,
        "gap_count": gap["gap_count"],
        "strength_count": gap["strength_count"],
    }


def _generate_phases(gap: dict, gap_courses: list, pref_courses: list, career: dict) -> list[dict]:
    phases = []

    # Phase 1: Foundation — close high-priority gaps
    phase1_skills = gap["high_priority_gaps"] or gap["missing_required"][:3]
    phase1_courses = [c for c in gap_courses if c["skill_name"].lower() in phase1_skills][:3]
    phases.append({
        "phase": 1,
        "title": "Foundation & Core Skills",
        "description": f"Build the essential skills required for {career['title']}.",
        "duration_weeks": 6,
        "focus_skills": phase1_skills,
        "actions": [
            f"Complete course: {c['title']} ({c['provider']})" for c in phase1_courses
        ] + [
            "Build a small project applying each new skill",
            "Track progress weekly in a learning journal",
        ],
        "courses": [_course_summary(c) for c in phase1_courses],
        "milestone": "Complete 3 foundational courses and 1 mini project",
    })

    # Phase 2: Specialisation — preferred skills + portfolio project
    phase2_skills = gap["medium_priority_gaps"][:3] + (gap["missing_required"][3:5] if len(gap["missing_required"]) > 3 else [])
    phase2_courses = pref_courses[:2] + [c for c in gap_courses if c not in phase1_courses][:2]
    phases.append({
        "phase": 2,
        "title": "Specialisation & Portfolio Building",
        "description": "Deepen expertise and build a portfolio-worthy project.",
        "duration_weeks": 8,
        "focus_skills": phase2_skills or ["system design", "best practices"],
        "actions": [
            f"Complete course: {c['title']} ({c['provider']})" for c in phase2_courses
        ] + [
            "Build 1 full-stack portfolio project end-to-end",
            "Publish project on GitHub with a strong README",
            "Write a technical blog post about what you built",
        ],
        "courses": [_course_summary(c) for c in phase2_courses],
        "milestone": "1 deployed portfolio project + GitHub profile active",
    })

    # Phase 3: Job Readiness
    phases.append({
        "phase": 3,
        "title": "Job Readiness & Applications",
        "description": "Prepare for interviews and start applying.",
        "duration_weeks": 4,
        "focus_skills": ["interview prep", "resume building", "networking"],
        "actions": [
            "Solve 50 LeetCode problems (Easy + Medium)",
            "Prepare STAR stories for 5 past experiences",
            "Update LinkedIn profile and resume",
            f"Apply to 15+ {career['title']} roles on LinkedIn, Naukri, and SkillBridge",
            "Do 3 mock interviews with peers or AI",
        ],
        "courses": [],
        "milestone": f"5 interview calls for {career['title']} roles",
    })

    return phases


def _course_summary(course: dict) -> dict:
    return {
        "title": course.get("title", ""),
        "provider": course.get("provider", ""),
        "duration_weeks": course.get("duration_weeks", 4),
        "is_free": course.get("is_free", False),
        "url": course.get("url", "#"),
    }
