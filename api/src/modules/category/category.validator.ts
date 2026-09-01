import { CustomAppError } from "@/lib/errors/customAppError";
import { ErrorCodes } from "@/lib/errors/errorCodes";
import { CreateCategoryDTO } from "@/types/category.type";

function fail(message: string): never {
  throw new CustomAppError( message, 400, ErrorCodes.VALIDATION_FAILED.code, ErrorCodes.VALIDATION_FAILED.label, "validation_failed" );
}

export function validateCreateCategory(data: CreateCategoryDTO) {
  if (!data.name) fail("name is required");
  if (!data.createdBy) fail("createdBy is required");
}