export type Role = "NOMINEE" | "ADMIN" | "SUPER_ADMIN";
export type Gender = "MALE" | "FEMALE";
export type Interest = "EXPLORING" | "COMMITTED" | "HIGHLY_COMMITTED" | "FULLY_COMMITTED";
export type UserStatus = "ACTIVE" | "INACTIVE";
export interface Category { id: string; name: string; description?: string | null; createdAt: string; }
export interface CreateCategory { name: string; description?: string; }
export interface User { id: string; firstName: string; lastName: string; nickName?: string | null; phoneNumber: string; gender: Gender; profileImage?: string | null; profileChangeCount: number; role: Role; category: string; interest: Interest; status: UserStatus; isActive: boolean; createdAt: string; updatedAt: string; nomineeCode?: string | null; }
export interface ApiResponse<T> { success: boolean; data: T; message?: string; }
export interface UserList { users: User[]; count: number; }
export interface CategoryList { categories: Category[]; count: number; }
export interface LoginResult { user: Pick<User, "id" | "firstName" | "lastName" | "phoneNumber" | "role">; }
export interface CreateUser { firstName: string; lastName: string; nickName?: string; phoneNumber: string; gender: Gender; password: string; role: "NOMINEE" | "ADMIN" | "SUPER_ADMIN"; category?: string; interest?: Interest; }