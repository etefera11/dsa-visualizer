from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from models import SortRequest, SortResponse, QuizRequest, QuizResponse, QuizQuestion, LinkedListRequest, LinkedListResponse
from algorithms.sorting.bubble import bubble_sort
from algorithms.sorting.merge import merge_sort
from algorithms.sorting.quick import quick_sort
from algorithms.linked_list.operations import traverse, search, insert_tail, delete

app = FastAPI(title="DSA Visualizer API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server; update for prod
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------

@app.get("/health")
def health():
    return {"status": "ok"}


# ---------------------------------------------------------------------------
# Sorting
# ---------------------------------------------------------------------------

SORTING_ALGORITHMS = {
    "bubble": bubble_sort,
    "merge": merge_sort,
    "quick": quick_sort,
}

@app.post("/algorithms/sort/{algorithm}", response_model=SortResponse)
def run_sort(algorithm: str, body: SortRequest):
    if algorithm not in SORTING_ALGORITHMS:
        raise HTTPException(
            status_code=404,
            detail=f"Unknown algorithm '{algorithm}'. Available: {list(SORTING_ALGORITHMS.keys())}",
        )

    if len(body.array) < 2:
        raise HTTPException(status_code=400, detail="Array must have at least 2 elements")

    if len(body.array) > 100:
        raise HTTPException(status_code=400, detail="Array must have at most 100 elements")

    fn = SORTING_ALGORITHMS[algorithm]
    steps = list(fn(body.array))

    total_comparisons = sum(1 for s in steps if s.comparing)
    total_swaps = sum(1 for s in steps if s.swapped)

    return SortResponse(
        algorithm=algorithm,
        steps=steps,
        total_comparisons=total_comparisons,
        total_swaps=total_swaps,
    )

# ---------------------------------------------------------------------------
# Linked List
# ---------------------------------------------------------------------------

LINKED_LIST_OPERATIONS = {
    "traverse": traverse,
    "search": search,
    "insert": insert_tail,
    "delete": delete,
}

@app.post("/algorithms/linked-list/{operation}", response_model=LinkedListResponse)
def run_linked_list(operation: str, body: LinkedListRequest):
    if operation not in LINKED_LIST_OPERATIONS:
        raise HTTPException(
            status_code=404,
            detail=f"Unknown operation '{operation}'. Available: {list(LINKED_LIST_OPERATIONS.keys())}",
        )
    if len(body.values) < 1:
        raise HTTPException(status_code=400, detail="List must have at least 1 node")

    fn = LINKED_LIST_OPERATIONS[operation]
    kwargs = {"target": body.target} if body.target is not None else {}
    steps = list(fn(body.values, **kwargs))

    return LinkedListResponse(operation=operation, steps=steps)

# ---------------------------------------------------------------------------
# Quiz (stub — full implementation next)
# ---------------------------------------------------------------------------

@app.post("/quiz", response_model=QuizResponse)
def get_quiz(body: QuizRequest):
    # Placeholder — returns a hardcoded bubble sort complexity question
    # so the frontend integration can be wired up before quiz logic is complete
    return QuizResponse(
        questions=[
            QuizQuestion(
                question="What is the worst-case time complexity of bubble sort?",
                options=["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
                correct_index=2,
                explanation=(
                    "In the worst case (reverse-sorted array), bubble sort performs "
                    "n*(n-1)/2 comparisons — one for every pair — giving O(n²)."
                ),
            )
        ]
    )
