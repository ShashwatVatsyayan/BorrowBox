"""
BorrowBox Search Relevance and Ranking Engine
Implements BM25/TF-IDF similarity ranking across item title, category,
and description for optimized query resolution on campus listings.
"""

import math
from typing import List, Dict, Any
from classifier import tokenize


class SearchRanker:
    def __init__(self, k1: float = 1.5, b: float = 0.75):
        self.k1 = k1
        self.b = b

    def rank(self, query: str, items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        query_tokens = tokenize(query)
        if not query_tokens:
            return items

        # Corpus statistics
        doc_count = len(items)
        if doc_count == 0:
            return []

        doc_lengths = []
        doc_token_counts = []
        df: Dict[str, int] = {}

        for item in items:
            combined = f"{item.get('title', '')} {item.get('title', '')} {item.get('category', '')} {item.get('description', '')}"
            tokens = tokenize(combined)
            doc_lengths.append(len(tokens))
            counts: Dict[str, int] = {}
            for t in tokens:
                counts[t] = counts.get(t, 0) + 1
            doc_token_counts.append(counts)

            for unique_token in set(tokens):
                df[unique_token] = df.get(unique_token, 0) + 1

        avg_doc_len = sum(doc_lengths) / max(1, doc_count)

        scored_items = []
        for idx, item in enumerate(items):
            score = 0.0
            doc_len = doc_lengths[idx]
            counts = doc_token_counts[idx]

            for qt in query_tokens:
                if qt in df:
                    # IDF formula
                    n_qt = df[qt]
                    idf = math.log((doc_count - n_qt + 0.5) / (n_qt + 0.5) + 1.0)
                    freq = counts.get(qt, 0)
                    tf = (freq * (self.k1 + 1)) / (freq + self.k1 * (1 - self.b + self.b * (doc_len / avg_doc_len)))
                    score += idf * tf

            # Title exact containment boost
            title_lower = item.get("title", "").lower()
            if query.lower() in title_lower:
                score += 5.0

            scored_items.append((score, item))

        # Sort descending by relevance score
        scored_items.sort(key=lambda x: x[0], reverse=True)
        return [item for score, item in scored_items if score > 0] or items


if __name__ == "__main__":
    test_items = [
        {"id": "1", "title": "Casio fx-991EX Calculator", "category": "Electronics & Calculators", "description": "ClassWiz scientific calculator"},
        {"id": "2", "title": "White Lab Coat", "category": "Lab & Safety Equipment", "description": "Chemistry laboratory coat"},
        {"id": "3", "title": "Calculus Early Transcendentals", "category": "Textbooks & Notes", "description": "Stewart calculus book"}
    ]
    ranker = SearchRanker()
    ranked = ranker.rank("calculator", test_items)
    print(f"Top result for 'calculator': {ranked[0]['title']}")

