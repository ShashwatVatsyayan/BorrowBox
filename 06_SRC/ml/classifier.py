"""
BorrowBox Category Classification Engine
Analyzes listing text (title, description) and predicts the appropriate category
among the controlled PRD taxonomy:
- Textbooks & Notes
- Electronics & Calculators
- Lab & Safety Equipment
- Sports & Fitness
- Tools & Hardware
- Stationery & Drafting
- Other
"""

import re
import math
from collections import Counter
from typing import Dict, List, Tuple

TAXONOMY = [
    "Textbooks & Notes",
    "Electronics & Calculators",
    "Lab & Safety Equipment",
    "Sports & Fitness",
    "Tools & Hardware",
    "Stationery & Drafting",
    "Other",
]

CATEGORY_KEYWORDS = {
    "Textbooks & Notes": [
        "book", "textbook", "notes", "edition", "author", "syllabus", "exam",
        "engineering", "mathematics", "physics", "chemistry", "biology", "computer",
        "programming", "guide", "handbook", "paper", "reference", "solution", "manual"
    ],
    "Electronics & Calculators": [
        "calculator", "scientific", "casio", "fx-991", "display", "lcd", "battery",
        "charger", "cable", "adapter", "multimeter", "oscilloscope", "power", "bank",
        "usb", "headphones", "keyboard", "mouse", "electronic", "sensor", "arduino"
    ],
    "Lab & Safety Equipment": [
        "lab", "coat", "goggles", "safety", "gloves", "apron", "microscope",
        "beaker", "flask", "pipette", "cylinder", "thermometer", "test", "tube",
        "spectacles", "dissection", "biotech", "chemistry"
    ],
    "Sports & Fitness": [
        "badminton", "racket", "football", "basketball", "cricket", "bat", "ball",
        "shuttlecock", "gym", "dumbbell", "mat", "yoga", "shoes", "jersey",
        "gloves", "fitness", "grip", "table", "tennis", "volleyball"
    ],
    "Tools & Hardware": [
        "screwdriver", "wrench", "pliers", "soldering", "iron", "hammer", "drill",
        "cutter", "breadboard", "wire", "stripper", "screw", "tape", "glue", "gun",
        "kit", "hardware", "tool", "tester", "fastener"
    ],
    "Stationery & Drafting": [
        "drafter", "mini", "t-square", "compass", "protractor", "ruler", "scale",
        "pencil", "pen", "marker", "highlighter", "folder", "stapler", "binder",
        "drawing", "sheet", "canvas", "stationery", "eraser", "cutter"
    ]
}


def tokenize(text: str) -> List[str]:
    clean = re.sub(r"[^\w\s-]", " ", text.lower())
    tokens = clean.split()
    return [t for t in tokens if len(t) > 1]


def predict_category(title: str, description: str = "") -> Tuple[str, float]:
    """
    Predicts the category with a normalized confidence score between 0.0 and 1.0.
    """
    combined = f"{title} {description}"
    tokens = tokenize(combined)
    if not tokens:
        return "Other", 0.0

    scores: Dict[str, float] = {cat: 0.0 for cat in TAXONOMY}

    title_tokens = set(tokenize(title))

    for cat, keywords in CATEGORY_KEYWORDS.items():
        match_count = 0.0
        for kw in keywords:
            for token in tokens:
                if kw == token:
                    weight = 2.5 if token in title_tokens else 1.0
                    match_count += weight
                elif len(token) > 4 and (kw in token or token in kw):
                    weight = 1.2 if token in title_tokens else 0.5
                    match_count += weight
        scores[cat] = match_count

    top_cat = max(scores, key=scores.get)
    max_score = scores[top_cat]

    if max_score <= 0.5:
        return "Other", 0.35

    total = sum(scores.values()) + 1e-6
    confidence = min(0.98, max(0.40, max_score / total))
    return top_cat, round(confidence, 3)


def assess_listing_quality(title: str, description: str, condition: str, location: str) -> Dict[str, any]:
    """
    Computes listing health and completeness score out of 100.
    """
    score = 0
    feedback = []

    # Title check
    if len(title.strip()) >= 10:
        score += 25
    elif len(title.strip()) >= 3:
        score += 15
        feedback.append("Title could be more descriptive")
    else:
        feedback.append("Title is too short")

    # Description check
    desc_len = len(description.strip())
    if desc_len >= 50:
        score += 35
    elif desc_len >= 20:
        score += 20
        feedback.append("Consider adding more details to description")
    else:
        feedback.append("Description is very brief")

    # Condition check
    if condition in ["Like New", "Good", "Fair", "Well Used"]:
        score += 20
    else:
        feedback.append("Invalid or missing condition rating")

    # Location check
    if len(location.strip()) >= 5:
        score += 20
    else:
        feedback.append("Pickup location details are minimal")

    return {
        "score": score,
        "is_acceptable": score >= 60,
        "feedback": feedback
    }


if __name__ == "__main__":
    sample_title = "Casio Scientific Calculator FX 991EX ClassWiz"
    sample_desc = "Standard solar powered calculator with dual power and high res display for engineering math."
    cat, conf = predict_category(sample_title, sample_desc)
    print(f"Predicted Category: {cat} (Confidence: {conf})")
    quality = assess_listing_quality(sample_title, sample_desc, "Like New", "Block B Academic Building")
    print(f"Quality Score: {quality['score']}/100, Acceptable: {quality['is_acceptable']}")

