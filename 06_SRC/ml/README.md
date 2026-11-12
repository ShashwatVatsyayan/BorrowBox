# BorrowBox Machine Learning Utilities

This module contains lightweight classification and ranking services for BorrowBox:

## Modules
1. `classifier.py`:
   - `predict_category(title, description)`: Predicts the primary PRD taxonomy category along with a confidence metric.
   - `assess_listing_quality(title, description, condition, location)`: Evaluates completeness and quality score (0-100) with actionable feedback.

2. `ranker.py`:
   - `SearchRanker`: Implements BM25/TF-IDF token relevance scoring and query containment weighting for item search.

3. `evaluate.py`:
   - Automated benchmark test suite verifying classification precision and ranking order.

