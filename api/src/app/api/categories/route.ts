import { NextRequest } from "next/server";
import { CategoryController } from "@/modules/category/category.controller";
import { handleError, ok } from "@/lib/errors/globalError";
import type { FilterCategoryDTO } from "@/types/category.type";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const filters: FilterCategoryDTO = {
      name: params.get("name") ?? undefined,
    };
    return ok(await CategoryController.getCategories(filters));
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    return ok(await CategoryController.createCategory(await request.json()), 201);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { ids } = await request.json();
    return ok(await CategoryController.deleteCategories(ids));
  } catch (error) {
    return handleError(error);
  }
}
