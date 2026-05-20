from typing import Generator
from models import SortStep


def quick_sort(arr: list[int]) -> Generator[SortStep, None, None]:
    arr = arr.copy()
    n = len(arr)
    sorted_indices: set[int] = set()

    yield from _quick_sort(arr, 0, n - 1, sorted_indices)

    yield SortStep(
        array=arr.copy(),
        comparing=[],
        swapped=False,
        sorted_indices=list(range(n)),
        description="Array fully sorted!",
    )


def _quick_sort(arr, low, high, sorted_indices):
    if low >= high:
        if low == high:
            sorted_indices.add(low)
        return

    pivot = arr[high]
    yield SortStep(
        array=arr.copy(),
        comparing=[high],
        swapped=False,
        sorted_indices=list(sorted_indices),
        description=f"Pivot selected: {pivot} at index {high} — partitioning indices {low}–{high}",
    )

    pivot_index = yield from _partition(arr, low, high, sorted_indices)

    sorted_indices.add(pivot_index)
    yield SortStep(
        array=arr.copy(),
        comparing=[pivot_index],
        swapped=False,
        sorted_indices=list(sorted_indices),
        description=f"Pivot {arr[pivot_index]} is now in its final position at index {pivot_index}",
    )

    yield from _quick_sort(arr, low, pivot_index - 1, sorted_indices)
    yield from _quick_sort(arr, pivot_index + 1, high, sorted_indices)


def _partition(arr, low, high, sorted_indices):
    pivot = arr[high]
    i = low - 1

    for j in range(low, high):
        yield SortStep(
            array=arr.copy(),
            comparing=[j, high],
            swapped=False,
            sorted_indices=list(sorted_indices),
            description=f"Comparing {arr[j]} with pivot {pivot}",
        )

        if arr[j] <= pivot:
            i += 1
            if i != j:
                arr[i], arr[j] = arr[j], arr[i]
                yield SortStep(
                    array=arr.copy(),
                    comparing=[i, j],
                    swapped=True,
                    sorted_indices=list(sorted_indices),
                    description=f"Swapped {arr[j]} and {arr[i]} — {arr[i]} belongs left of pivot",
                )

    pivot_index = i + 1
    arr[pivot_index], arr[high] = arr[high], arr[pivot_index]

    yield SortStep(
        array=arr.copy(),
        comparing=[pivot_index, high],
        swapped=True,
        sorted_indices=list(sorted_indices),
        description=f"Placed pivot {pivot} into final position at index {pivot_index}",
    )

    return pivot_index