from pydantic import BaseModel
from typing import Optional


# --- Sorting ---

class SortRequest(BaseModel):
    array: list[int]


class SortStep(BaseModel):
    array: list[int]
    comparing: list[int]       # indices currently being compared
    swapped: bool
    sorted_indices: list[int]  # indices that are in their final position
    description: str


class SortResponse(BaseModel):
    algorithm: str
    steps: list[SortStep]
    total_comparisons: int
    total_swaps: int


# --- Quiz ---

class QuizQuestion(BaseModel):
    question: str
    options: list[str]
    correct_index: int
    explanation: str


class QuizRequest(BaseModel):
    algorithm: str
    topic: str  # "complexity", "trace", "concept"


class QuizResponse(BaseModel):
    questions: list[QuizQuestion]