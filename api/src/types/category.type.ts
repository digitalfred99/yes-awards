export type CreateCategoryDTO = {
  name: string;
  description?: string;
  createdBy: string;
};

export type UpdateCategoryDTO = Partial<{
  name: string;
  description: string;
}>;

export type FilterCategoryDTO = {
  name?: string;
};