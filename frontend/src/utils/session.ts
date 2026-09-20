import type { LoginResult } from "../types";
const KEY = "od-yes-session";
export const session = { get: () => { try { return JSON.parse(localStorage.getItem(KEY) ?? "null") as LoginResult | null; } catch { return null; } }, set: (value: LoginResult) => localStorage.setItem(KEY, JSON.stringify(value)), clear: () => localStorage.removeItem(KEY) };
