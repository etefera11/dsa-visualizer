from typing import Generator
from models import LinkedListStep, LLNode


def _snapshot(values: list[int], active=None, comparing=None, new=None, desc="") -> LinkedListStep:
    return LinkedListStep(
        nodes=[LLNode(value=v, index=i) for i, v in enumerate(values)],
        active_index=active,
        comparing_index=comparing,
        new_index=new,
        description=desc,
    )


def traverse(values: list[int], **_) -> Generator[LinkedListStep, None, None]:
    """Walk each node one by one, head to tail."""
    yield _snapshot(values, desc="Starting traversal at head")

    for i in range(len(values)):
        yield _snapshot(values, active=i,
            desc=f"Visiting node {i}: value = {values[i]}")

    yield _snapshot(values, desc="Reached null — traversal complete")


def search(values: list[int], target: int, **_) -> Generator[LinkedListStep, None, None]:
    """Linear search — visit each node and compare to target."""
    yield _snapshot(values, desc=f"Searching for {target} starting at head")

    for i in range(len(values)):
        yield _snapshot(values, active=i,
            desc=f"Checking node {i}: is {values[i]} == {target}?")

        if values[i] == target:
            yield _snapshot(values, comparing=i,
                desc=f"Found {target} at index {i}!")
            return

    yield _snapshot(values, desc=f"{target} not found in list")


def insert_tail(values: list[int], target: int, **_) -> Generator[LinkedListStep, None, None]:
    """Traverse to the tail, then append a new node."""
    yield _snapshot(values, desc=f"Inserting {target} — traversing to tail")

    for i in range(len(values)):
        yield _snapshot(values, active=i,
            desc=f"Visiting node {i} (value={values[i]}) — not the tail yet" if i < len(values) - 1
                 else f"Reached tail: node {i} (value={values[i]})")

    values = values + [target]
    new_i = len(values) - 1

    yield _snapshot(values, new=new_i,
        desc=f"Appended new node {target} — tail's next now points here")

    yield _snapshot(values, desc=f"Insertion complete — list has {len(values)} nodes")


def delete(values: list[int], target: int, **_) -> Generator[LinkedListStep, None, None]:
    """Search for target, then redirect the previous node's pointer to skip it."""
    yield _snapshot(values, desc=f"Deleting {target} — searching from head")

    prev = None
    for i in range(len(values)):
        yield _snapshot(values, active=i,
            desc=f"Checking node {i}: is {values[i]} == {target}?")

        if values[i] == target:
            if prev is None:
                yield _snapshot(values, comparing=i,
                    desc=f"Found {target} at head — moving head pointer to node 1")
            else:
                yield _snapshot(values, comparing=i,
                    desc=f"Found {target} at index {i} — node {prev} will skip over it")

            new_values = [v for j, v in enumerate(values) if j != i]
            yield _snapshot(new_values, desc=f"Node {target} removed — list has {len(new_values)} nodes")
            return

        prev = i

    yield _snapshot(values, desc=f"{target} not found — nothing deleted")