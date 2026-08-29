import { NextRequest } from "next/server";
import { extractFile } from "@/lib/http/parseFormData";
import { handleError, ok } from "@/lib/errors/globalError";
import { CustomAppError } from "@/lib/errors/customAppError";
import { ErrorCodes } from "@/lib/errors/errorCodes";
import { UserController } from "@/modules/user/user.controller";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const image = await extractFile(await request.formData(), "profileImage");
    if (!image) {
      throw new CustomAppError("profileImage is required", 400, ErrorCodes.INPUT_REQUIRED.code, ErrorCodes.INPUT_REQUIRED.label, "validation_failed");
    }
    if (!image.mimeType.startsWith("image/")) {
      throw new CustomAppError("profileImage must be an image", 400, ErrorCodes.INVALID_FILE_TYPE.code, ErrorCodes.INVALID_FILE_TYPE.label, "validation_failed");
    }

    return ok(await UserController.updateProfileImage((await params).id, {
      fieldName: "profileImage",
      buffer: image.buffer,
      originalName: image.originalName,
    }));
  } catch (error) {
    return handleError(error);
  }
}
