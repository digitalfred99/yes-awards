import { request } from "./client";
import type { Category, CategoryList, CreateCategory, CreateUser, LoginResult, User, UserList } from "../types";
import { session } from "../utils/session";
export const awardsApi = {
  categories: (name = "") => request<CategoryList>(`/categories${name ? `?name=${encodeURIComponent(name)}` : ""}`),
  createCategory: (data: CreateCategory) => request<Category>("/categories", { method: "POST", body: JSON.stringify(data) }),
  updateCategory: (id: string, data: Partial<CreateCategory>) => request<Category>(`/categories/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteCategories: (ids: string[]) => request<unknown>("/categories", { method: "DELETE", body: JSON.stringify({ ids }) }),
  users: (filters = "") => request<UserList>(`/users${filters ? `?${filters}` : ""}`).then(data => { const current = session.get(); return current?.user.role === "ADMIN" ? { ...data, users: data.users.filter(user => user.role !== "SUPER_ADMIN") } : data; }),
  user: (id: string) => request<User>(`/users/${id}`),
  createUser: (data: CreateUser) => request<User>("/users", { method: "POST", body: JSON.stringify(data) }),
  deleteUsers: (ids: string[]) => request<unknown>("/users", { method: "DELETE", body: JSON.stringify({ ids }) }),
  updateUser: (id: string, data: Partial<Pick<User, "firstName" | "lastName" | "nickName" | "gender" | "category" | "interest">> & { password?: string }) => request<User>(`/users/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  uploadPhoto: (id: string, file: File) => { const form = new FormData(); form.append("profileImage", file); return request<User>(`/users/${id}/profile-image`, { method: "PATCH", body: form }); },
  resetProfileChangeCount: (id: string) => request<User>(`/users/${id}/profile-image/reset-count`, { method: "PATCH" }),
  toggleStatus: (id: string) => request<User>(`/users/${id}/status`, { method: "PATCH" }),
  login: (phoneNumber: string, password: string) => request<LoginResult>("/auth/login", { method: "POST", body: JSON.stringify({ phoneNumber, password }) }),
};
