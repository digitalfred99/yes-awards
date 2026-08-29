import type { UserRole, Gender, UserInterest, UserStatus } from "@/database/entities/User";

// ── Create ───────────────────────────────────────────────────────
export type CreateUserDTO = {
  firstName: string;
  lastName: string;
  nickName?: string;
  password: string;
  phoneNumber: string;
  gender: Gender;
  role: UserRole;
  category?: string;
  interest?: UserInterest;
};

// ── Update ───────────────────────────────────────────────────────
export type UpdateUserDTO = Partial<{
  firstName: string;
  lastName: string;
  nickName: string;
  gender: Gender;
  category: string;
  interest: UserInterest;
  password: string;
}>;

// ── Filter (list/search) ────────────────────────────────────────
export type FilterUserDTO = {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  gender?: Gender;
  role?: UserRole;
  category?: string;
  status?: UserStatus;
  isActive?: boolean;
};
