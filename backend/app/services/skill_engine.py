"""
Skill Engine — Assessment, Scoring & Mapping
---------------------------------------------
All calculations are fully deterministic (no randomness).
"""
from typing import Optional

# ── Proficiency level → base score (0-100) ──────────────────────────────────
PROFICIENCY_BASE = {
    "BEGINNER": 20.0,
    "INTERMEDIATE": 50.0,
    "ADVANCED": 75.0,
    "EXPERT": 95.0,
}

# ── Skill → Domain mapping ───────────────────────────────────────────────────
SKILL_DOMAIN_MAP: dict[str, str] = {
    # Software Engineering
    "python": "Software Engineering",
    "java": "Software Engineering",
    "javascript": "Software Engineering",
    "typescript": "Software Engineering",
    "c++": "Software Engineering",
    "c": "Software Engineering",
    "go": "Software Engineering",
    "rust": "Software Engineering",
    "fastapi": "Software Engineering",
    "django": "Software Engineering",
    "flask": "Software Engineering",
    "spring boot": "Software Engineering",
    "react": "Frontend Development",
    "vue": "Frontend Development",
    "angular": "Frontend Development",
    "html": "Frontend Development",
    "css": "Frontend Development",
    "tailwind": "Frontend Development",
    # Data & AI
    "machine learning": "Data Science & AI",
    "deep learning": "Data Science & AI",
    "tensorflow": "Data Science & AI",
    "pytorch": "Data Science & AI",
    "scikit-learn": "Data Science & AI",
    "pandas": "Data Science & AI",
    "numpy": "Data Science & AI",
    "sql": "Data Science & AI",
    "tableau": "Data Science & AI",
    "power bi": "Data Science & AI",
    "nlp": "Data Science & AI",
    "computer vision": "Data Science & AI",
    # Cloud & DevOps
    "aws": "Cloud & DevOps",
    "azure": "Cloud & DevOps",
    "gcp": "Cloud & DevOps",
    "docker": "Cloud & DevOps",
    "kubernetes": "Cloud & DevOps",
    "ci/cd": "Cloud & DevOps",
    "linux": "Cloud & DevOps",
    "terraform": "Cloud & DevOps",
    # Cybersecurity
    "network security": "Cybersecurity",
    "penetration testing": "Cybersecurity",
    "cryptography": "Cybersecurity",
    "ethical hacking": "Cybersecurity",
    # Product & Management
    "product management": "Product & Management",
    "agile": "Product & Management",
    "scrum": "Product & Management",
    "jira": "Product & Management",
    # Soft skills
    "communication": "Soft Skills",
    "leadership": "Soft Skills",
    "teamwork": "Soft Skills",
    "problem solving": "Soft Skills",
}

# ── Domain weights for overall score ────────────────────────────────────────
DOMAIN_WEIGHTS = {
    "Software Engineering": 1.0,
    "Data Science & AI": 1.0,
    "Cloud & DevOps": 0.9,
    "Frontend Development": 0.9,
    "Cybersecurity": 0.9,
    "Product & Management": 0.7,
    "Soft Skills": 0.5,
}


def score_skill(skill_name: str, proficiency: str, years_experience: float = 0.0) -> float:
    """
    Deterministic skill score (0-100).
    Formula: base_score + experience_bonus + domain_weight_adjustment
    """
    base = PROFICIENCY_BASE.get(proficiency.upper(), 20.0)
    # Experience bonus: +2 per year, capped at +20
    exp_bonus = min(years_experience * 2.0, 20.0)
    score = min(base + exp_bonus, 100.0)
    return round(score, 2)


def get_skill_domain(skill_name: str) -> str:
    return SKILL_DOMAIN_MAP.get(skill_name.lower().strip(), "General")


def compute_overall_score(skills: list[dict]) -> float:
    """
    Weighted average score across all skills.
    skills: list of {"skill_name": str, "score": float}
    """
    if not skills:
        return 0.0
    total_weight = 0.0
    weighted_sum = 0.0
    for s in skills:
        domain = get_skill_domain(s["skill_name"])
        weight = DOMAIN_WEIGHTS.get(domain, 0.8)
        weighted_sum += s["score"] * weight
        total_weight += weight
    return round(weighted_sum / total_weight, 2) if total_weight else 0.0


def get_top_domain(skills: list[dict]) -> str:
    """Returns the domain in which the student has the highest average score."""
    domain_scores: dict[str, list[float]] = {}
    for s in skills:
        domain = get_skill_domain(s["skill_name"])
        domain_scores.setdefault(domain, []).append(s["score"])
    if not domain_scores:
        return "General"
    return max(domain_scores, key=lambda d: sum(domain_scores[d]) / len(domain_scores[d]))


def normalize_skill_name(name: str) -> str:
    return name.lower().strip()
