import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
const client = axios.create({ baseURL: BASE_URL });

// --- Sorting ---

export interface SortStep {
  array: number[];
  comparing: number[];
  swapped: boolean;
  sorted_indices: number[];
  description: string;
}

export interface SortResponse {
  algorithm: string;
  steps: SortStep[];
  total_comparisons: number;
  total_swaps: number;
}

export async function runSort(algorithm: string, array: number[]): Promise<SortResponse> {
  const { data } = await client.post<SortResponse>(`/algorithms/sort/${algorithm}`, { array });
  return data;
}

// --- Linked List ---

export interface LLNode {
  value: number;
  index: number;
}

export interface LinkedListStep {
  nodes: LLNode[];
  active_index: number | null;
  comparing_index: number | null;
  new_index: number | null;
  description: string;
}

export interface LinkedListResponse {
  operation: string;
  steps: LinkedListStep[];
}

export async function runLinkedList(
  operation: string,
  values: number[],
  target?: number
): Promise<LinkedListResponse> {
  const { data } = await client.post<LinkedListResponse>(
    `/algorithms/linked-list/${operation}`,
    { values, target }
  );
  return data;
}

// --- Quiz ---

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

export interface QuizResponse {
  questions: QuizQuestion[];
}

export async function fetchQuiz(algorithm: string, array: number[]): Promise<QuizResponse> {
  const { data } = await client.post<QuizResponse>("/quiz", { algorithm, array });
  return data;
}