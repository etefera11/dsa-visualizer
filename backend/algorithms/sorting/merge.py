from typing import Generator
from models import SortStep


def merge_sort(arr: list[int]) -> Generator[SortStep, None, None]:
    """
    Merge sort implemented as a recursive generator.

    Key Python concept: `yield from` delegates to a sub-generator,
    meaning recursive calls can also yield steps back up to the caller.

    Divide phase: split the array in half recursively until subarrays
    are length 1 (already sorted by definition).

    Merge phase: compare elements from two sorted halves and place the
    smaller one — building a sorted result bottom-up.
    """
    arr = arr.copy()
    n = len(arr)
    sorted_indices: set[int] = set()

    yield from _merge_sort(arr, 0, n - 1, sorted_indices, n)

    # Final step
    yield SortStep(
        array=arr.copy(),
        comparing=[],
        swapped=False,
        sorted_indices=list(range(n)),
        description="Array fully sorted!",
    )


def _merge_sort(
    arr: list[int],
    left: int,
    right: int,
    sorted_indices: set[int],
    n: int,
) -> Generator[SortStep, None, None]:
    if left >= right:
        return

    mid = (left + right) // 2

    # Show the divide step
    yield SortStep(
        array=arr.copy(),
        comparing=[left, right],
        swapped=False,
        sorted_indices=list(sorted_indices),
        description=f"Dividing indices {left}–{right} at midpoint {mid}",
    )

    # Recurse on left half, then right half
    yield from _merge_sort(arr, left, mid, sorted_indices, n)
    yield from _merge_sort(arr, mid + 1, right, sorted_indices, n)

    # Merge the two sorted halves back together
    yield from _merge(arr, left, mid, right, sorted_indices)


def _merge(
    arr: list[int],
    left: int,
    mid: int,
    right: int,
    sorted_indices: set[int],
) -> Generator[SortStep, None, None]:
    left_half = arr[left : mid + 1]
    right_half = arr[mid + 1 : right + 1]

    i = j = 0       # pointers into left_half and right_half
    k = left        # pointer into arr (where we're placing)

    while i < len(left_half) and j < len(right_half):
        # Show the comparison
        yield SortStep(
            array=arr.copy(),
            comparing=[left + i, mid + 1 + j],
            swapped=False,
            sorted_indices=list(sorted_indices),
            description=(
                f"Comparing {left_half[i]} (left) and {right_half[j]} (right)"
            ),
        )

        if left_half[i] <= right_half[j]:
            arr[k] = left_half[i]
            i += 1
        else:
            arr[k] = right_half[j]
            j += 1

        # Show the placement
        yield SortStep(
            array=arr.copy(),
            comparing=[k],
            swapped=True,
            sorted_indices=list(sorted_indices),
            description=f"Placed {arr[k]} at position {k}",
        )
        k += 1

    # Drain any remaining elements from the left half
    while i < len(left_half):
        arr[k] = left_half[i]
        yield SortStep(
            array=arr.copy(),
            comparing=[k],
            swapped=True,
            sorted_indices=list(sorted_indices),
            description=f"Copying remaining left element {arr[k]} to position {k}",
        )
        i += 1
        k += 1

    # Drain any remaining elements from the right half
    while j < len(right_half):
        arr[k] = right_half[j]
        yield SortStep(
            array=arr.copy(),
            comparing=[k],
            swapped=True,
            sorted_indices=list(sorted_indices),
            description=f"Copying remaining right element {arr[k]} to position {k}",
        )
        j += 1
        k += 1

    # Mark this merged range as sorted (it's in correct relative order)
    for idx in range(left, right + 1):
        sorted_indices.add(idx)
