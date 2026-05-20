import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

const client = axios.create({ baseURL: BASE_URL });

// --- Types (mirror backend Pydantic models) ---

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

// --- API calls ---

export async function runSort(
  algorithm: string,
  array: number[]
): Promise<SortResponse> {
  const { data } = await client.post<SortResponse>(
    `/algorithms/sort/${algorithm}`,
    { array }
  );
  return data;
}
