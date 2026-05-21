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

# --- Linked List ---

class LLNode(BaseModel):
    value: int
    index: int                  # position in the list

class LinkedListStep(BaseModel):
    nodes: list[LLNode]
    active_index: int | None    # node currently being visited
    comparing_index: int | None # node being compared (for search)
    new_index: int | None       # newly inserted node
    description: str

class LinkedListRequest(BaseModel):
    values: list[int]           # initial list
    target: int | None = None   # value to insert/delete/search

class LinkedListResponse(BaseModel):
    operation: str
    steps: list[LinkedListStep]
    
# --- Quiz ---

class QuizQuestion(BaseModel):
    question: str
    options: list[str]
    correct_index: int
    explanation: str


class QuizRequest(BaseModel):
    algorithm: str
    array: list[int]
    topic: str = "mixed"


class QuizResponse(BaseModel):
    questions: list[QuizQuestion]