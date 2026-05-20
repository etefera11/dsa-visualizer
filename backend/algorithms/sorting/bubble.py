from typing import Generator
from models import SortStep


def bubble_sort(arr: list[int]) -> Generator[SortStep, None, None]:
    """
    Bubble sort implemented as a generator that yields a SortStep
    at each meaningful operation (comparison and swap).

    This is the Step Emitter pattern: instead of returning a sorted array,
    we yield snapshots of state so the frontend can replay them at any speed.
    """
    arr = arr.copy()
    n = len(arr)
    sorted_indices: list[int] = []

    for i in range(n):
        swapped_this_pass = False

        for j in range(n - i - 1):
            # Yield the comparison step BEFORE deciding to swap
            yield SortStep(
                array=arr.copy(),
                comparing=[j, j + 1],
                swapped=False,
                sorted_indices=sorted_indices.copy(),
                description=f"Comparing {arr[j]} and {arr[j + 1]} at positions {j} and {j + 1}",
            )

            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped_this_pass = True

                # Yield the swap step showing the new array state
                yield SortStep(
                    array=arr.copy(),
                    comparing=[j, j + 1],
                    swapped=True,
                    sorted_indices=sorted_indices.copy(),
                    description=f"Swapped {arr[j + 1]} and {arr[j]} — larger value bubbles right",
                )

        # The last unsorted element is now in its final position
        sorted_indices.append(n - 1 - i)

        # Early exit: if no swaps occurred this pass, the array is sorted
        if not swapped_this_pass:
            break

    # Final step — everything is sorted
    yield SortStep(
        array=arr.copy(),
        comparing=[],
        swapped=False,
        sorted_indices=list(range(n)),
        description="Array fully sorted!",
    )