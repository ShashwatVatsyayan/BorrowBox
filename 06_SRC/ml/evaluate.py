"""
Evaluation and Benchmark Suite for ML Utilities
Validates classification accuracy, confidence calibration, and ranking performance.
"""

import sys
from classifier import predict_category, assess_listing_quality
from ranker import SearchRanker

BENCHMARK_CASES = [
    {
        "title": "Casio fx-82MS Scientific Calculator",
        "desc": "240 functions 2 line display battery operated calculator",
        "expected": "Electronics & Calculators"
    },
    {
        "title": "Cotton White Lab Coat for Chemistry Practical",
        "desc": "Knee length lab coat with safety pockets and buttons",
        "expected": "Lab & Safety Equipment"
    },
    {
        "title": "Higher Engineering Mathematics by B.S. Grewal",
        "desc": "Standard 44th edition textbook for engineering math",
        "expected": "Textbooks & Notes"
    },
    {
        "title": "Yonex Nanoray Badminton Racket",
        "desc": "Graphite shaft lightweight racket with thermal head cover",
        "expected": "Sports & Fitness"
    },
    {
        "title": "Mini Drafter and Engineering Drawing Compass Set",
        "desc": "Scale clamp and drafting tools for ED sheet submissions",
        "expected": "Stationery & Drafting"
    },
    {
        "title": "Digital Multimeter and Soldering Iron Kit",
        "desc": "60W adjustable temperature iron with stand and solder wire",
        "expected": "Tools & Hardware"
    }
]


def run_benchmark():
    correct = 0
    total = len(BENCHMARK_CASES)

    print("Running ML Benchmark Suite...")
    for idx, test in enumerate(BENCHMARK_CASES, 1):
        pred, conf = predict_category(test["title"], test["desc"])
        is_pass = pred == test["expected"]
        if is_pass:
            correct += 1
        status = "PASS" if is_pass else "FAIL"
        print(f"[{status}] Case {idx}: '{test['title'][:30]}...' -> Predicted: '{pred}' (Conf: {conf:.2f}), Expected: '{test['expected']}'")

    accuracy = (correct / total) * 100
    print(f"\nOverall Classification Accuracy: {accuracy:.1f}% ({correct}/{total})")

    # Quality check evaluation
    quality = assess_listing_quality("Casio fx-991EX ClassWiz", "Comprehensive description with all specifications and usage guidelines.", "Like New", "Academic Block C")
    assert quality["is_acceptable"], "Quality assessment should accept complete listing"
    print("Listing Quality Check: PASSED")

    # Ranker evaluation
    ranker = SearchRanker()
    items = [
        {"id": "1", "title": "Calculus Textbook", "category": "Textbooks & Notes", "description": "Math book"},
        {"id": "2", "title": "Scientific Calculator fx-991EX", "category": "Electronics & Calculators", "description": "Casio calculator"}
    ]
    ranked = ranker.rank("calculator", items)
    assert ranked[0]["id"] == "2", "Top search result for 'calculator' should be item 2"
    print("Search Ranker Test: PASSED")

    if accuracy < 80.0:
        sys.exit(1)


if __name__ == "__main__":
    run_benchmark()

