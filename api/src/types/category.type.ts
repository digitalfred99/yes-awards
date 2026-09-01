// ── Create ───────────────────────────────────────────────────────
export type CreateCategoryDTO = {
  name: string;
  description?: string;
  createdBy?: string;
};

// ── Update ───────────────────────────────────────────────────────
export type UpdateCategoryDTO = Partial<{
  name: string;
  description: string;
}>;

// ── Filter (list/search) ────────────────────────────────────────
export type FilterCategoryDTO = {
  name?: string;
};
