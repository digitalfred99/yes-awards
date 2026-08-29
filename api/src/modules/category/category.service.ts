import { validateCreateCategory } from "@/modules/category/category.validator";
import { validate as isUUID } from "uuid";
import { FindOptionsWhere, ILike, In, Not } from "typeorm";
import { AppDataSource } from "@/database/data-source";
import { Category } from "@/database/entities/Category";
import { CreateCategoryDTO, FilterCategoryDTO, UpdateCategoryDTO } from "@/types/category.type";
import { CustomAppError } from "@/lib/errors/customAppError";
import { ErrorCodes } from "@/lib/errors/errorCodes";
import { createWithImages, type ImageFileInput } from "@/lib/storage/createWithImages";

export class CategoryService {

  private static async repo() {
    const db = await AppDataSource();
    return db.getRepository(Category);
  }

  static async getCategories(filters: FilterCategoryDTO) {
    const repo = await this.repo();

    const where: FindOptionsWhere<Category> = { isDeleted: false };
    
    if (filters.name) where.name = ILike(`%${filters.name}%`);

    const [categories, count] = await repo.findAndCount({
      where,
      order: { createdAt: "DESC" },
    });

    return { categories, count };
  }

  static async getCategory(id: string) {
    if (!id || !isUUID(id)) {
      throw new CustomAppError("Valid Category ID is required", 400, ErrorCodes.ID_REQUIRED.code, ErrorCodes.ID_REQUIRED.label, "bad_request");
    }

    const repo = await this.repo();

    const category = await repo.findOne({
      where: { id, isDeleted: false },
    });

    if (!category) {
      throw new CustomAppError("No category found with the given ID", 404, ErrorCodes.USER_NOT_FOUND.code, ErrorCodes.USER_NOT_FOUND.label, "category_not_found");
    }

    return category;
  }

  static async create(data: CreateCategoryDTO) {
    const repo = await this.repo();
    data = { ...data, name: data.name?.trim().toUpperCase() };
    validateCreateCategory(data);

    const existingCategory = await repo.findOne({
      where: { name: data.name, isDeleted: false },
    });

    if (existingCategory) {
      throw new CustomAppError("Category with this name already exists", 400, ErrorCodes.RECORD_ALREADY_EXISTS.code, ErrorCodes.RECORD_ALREADY_EXISTS.label, "category_exists");
    }

    const newCategory = repo.create({
      name: data.name,
      description: data.description,
    });

    return await repo.save(newCategory);
  }

  static async update(id: string, data: UpdateCategoryDTO) {
    if (!id || !isUUID(id)) {
      throw new CustomAppError("Valid Category ID is required", 400, ErrorCodes.ID_REQUIRED.code, ErrorCodes.ID_REQUIRED.label, "bad_request");
    }

    const repo = await this.repo();
    data = { ...data, ...(data.name !== undefined ? { name: data.name.trim().toUpperCase() } : {}) };

    const existingCategory = await repo.findOne({ where: { id, isDeleted: false } });
    if (!existingCategory) {
      throw new CustomAppError("No category found with the given ID", 404, ErrorCodes.USER_NOT_FOUND.code, ErrorCodes.USER_NOT_FOUND.label, "category_not_found");
    }
    if (data.name && data.name != existingCategory.name) {
      const duplicateCategory = await repo.findOne({
        where: { name: data.name, isDeleted: false, id: Not(id), },
      });

      if (duplicateCategory) {
        throw new CustomAppError("Category with this name already exists", 400, ErrorCodes.RECORD_ALREADY_EXISTS.code, ErrorCodes.RECORD_ALREADY_EXISTS.label, "category_exists");
      }
    }

    const updatedCategory = repo.merge(existingCategory, data);
    return await repo.save(updatedCategory);
  }

  static async delete(ids: string[]) {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new CustomAppError("Invalid request IDs", 400, ErrorCodes.ID_REQUIRED.code, ErrorCodes.ID_REQUIRED.label, "bad_request");
    }

    const repo = await this.repo();

    const records = await repo.find({
      where: { id: In(ids), isDeleted: false },
    });

    if (records.length === 0) {
      throw new CustomAppError("No matching records found to delete", 404, ErrorCodes.RECORD_NOT_FOUND.code, ErrorCodes.RECORD_NOT_FOUND.label, "not_found");
    }

    records.forEach(record => {
      record.isDeleted = true;
    });

    return repo.save(records);
  }
}
