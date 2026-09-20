import { API_BASE } from "../config/brand";
import type { ApiResponse } from "../types";

export class ApiError extends Error { constructor(message: string) { super(message); } }
export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, { ...init, headers: { ...(init?.body instanceof FormData ? {} : { "Content-Type": "application/json" }), ...init?.headers } });
  const payload = await response.json().catch(() => null) as ApiResponse<T> | null;
  if (!response.ok || !payload?.success) throw new ApiError(payload?.message ?? "Something went wrong. Please try again.");
  return payload.data;
}
