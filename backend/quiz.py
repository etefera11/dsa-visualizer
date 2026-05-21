import os
import json
from dotenv import load_dotenv
from openai import AzureOpenAI
from models import QuizQuestion

load_dotenv()

client = AzureOpenAI(
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_KEY"),
    api_version="2024-08-01-preview",
)

DEPLOYMENT = os.getenv("AZURE_OPENAI_DEPLOYMENT", "gpt-4o")


def generate_quiz(algorithm: str, steps: list[dict], array: list[int]) -> list[QuizQuestion]:
    trace = steps[:10]
    trace_str = json.dumps(trace, indent=2)

    is_linked_list = algorithm.startswith("linked-list")
    topic = algorithm.replace("linked-list-", "") if is_linked_list else algorithm

    if is_linked_list:
        prompt = f"""
You are a computer science tutor helping a student learn linked list {topic} operations.
They just watched a {topic} operation on the list {array}.

Here are the first steps of the execution trace:
{trace_str}

Generate exactly 3 quiz questions to test their understanding. Mix these types:
1. A trace question — ask what happens at a specific step
2. A complexity question — ask about time complexity of this operation
3. A concept question — ask why linked lists handle this operation differently than arrays

Respond ONLY with a valid JSON array, no markdown, no explanation. Format:
[
  {{
    "question": "...",
    "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
    "correct_index": 0,
    "explanation": "..."
  }}
]
"""
    else:
        prompt = f"""
You are a computer science tutor helping a student learn {algorithm} sort.
They just watched it run on the array {array}.

Here are the first steps of the execution trace:
{trace_str}

Generate exactly 3 quiz questions to test their understanding. Mix these types:
1. A trace question — ask what the array looks like after a specific step
2. A complexity question — ask about time/space complexity
3. A concept question — ask why the algorithm behaves a certain way

Respond ONLY with a valid JSON array, no markdown, no explanation. Format:
[
  {{
    "question": "...",
    "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
    "correct_index": 0,
    "explanation": "..."
  }}
]
"""

    response = client.chat.completions.create(
        model=DEPLOYMENT,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        max_tokens=1000,
    )

    raw = response.choices[0].message.content.strip()

    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip()

    import re
    raw = re.sub(r',\s*([}\]])', r'\1', raw)
    
    data = json.loads(raw)
    return [QuizQuestion(**q) for q in data]