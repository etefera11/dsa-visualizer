# DSA Visualizer

Interactive DSA learning tool — watch algorithms run step by step, then get quizzed on what you just saw.

**Live demo:** https://dsa-visualizer.ezana.dev

## What it does

DSA Visualizer lets you select an algorithm or data structure operation, input your own array or list, and watch it execute one step at a time with color-coded animations. After watching, an AI-powered quiz generates questions based on the exact execution trace you just observed.

## Algorithms & Data Structures

**Sorting**
- Bubble sort
- Merge sort
- Quick sort

**Linked List**
- Traverse
- Search
- Insert (tail)
- Delete

## Architecture
<img width="789" height="338" alt="image" src="https://github.com/user-attachments/assets/9315cbbb-353f-4791-bf56-ef7c016a6534" />

React + D3.js (Azure Static Web Apps)
↓
FastAPI (Azure Container Apps)
↓
Azure OpenAI GPT-4o (quiz generation)
React frontend → FastAPI backend → algorithm executes as a Python generator → step snapshots returned → D3.js animates each snapshot → Azure OpenAI generates quiz questions from the execution trace

## Tech Stack

**Frontend**
- React + TypeScript
- D3.js (SVG animations)
- Vite
- Azure Static Web Apps

**Backend**
- Python / FastAPI
- Pydantic
- Azure Container Apps
- Azure Container Registry
- Docker

**AI**
- Azure OpenAI (GPT-4o)

**DevOps**
- GitHub Actions CI/CD
- Automated build and deploy on push to main

## Key Concept: Step Emitter Pattern

Every algorithm is implemented as a Python generator that `yield`s a state snapshot at each meaningful operation. This decouples execution from animation — the backend runs the full algorithm and returns all steps, and the frontend replays them at any speed with full playback controls.

```python
def bubble_sort(arr):
    for i in range(len(arr)):
        for j in range(len(arr) - i - 1):
            yield SortStep(array=arr.copy(), comparing=[j, j+1], ...)
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
                yield SortStep(array=arr.copy(), swapped=True, ...)
```

## Local Development

### Prerequisites
- Python 3.13
- Node.js 22+
- An Azure OpenAI deployment (GPT-4o)

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirements.txt
```
```bash
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Create `backend/.env`:
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_KEY=your_key
AZURE_OPENAI_DEPLOYMENT=gpt-4o
