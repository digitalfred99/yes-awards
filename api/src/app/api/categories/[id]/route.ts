import { NextRequest } from "next/server";
import { CategoryController } from "@/modules/category/category.controller";
import { handleError, ok } from "@/lib/errors/globalError";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    return ok(await CategoryController.getCategory((await params).id));
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    return ok(await CategoryController.updateCategory((await params).id, await request.json()));
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    return ok(await CategoryController.deleteCategories([(await params).id]));
  } catch (error) {
    return handleError(error);
  }
}
