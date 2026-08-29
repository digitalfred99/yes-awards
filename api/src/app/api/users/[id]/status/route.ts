import { NextRequest } from "next/server";
import { UserController } from "@/modules/user/user.controller";
import { handleError, ok } from "@/lib/errors/globalError";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(_request: NextRequest, { params }: RouteContext) {
  try {
    return ok(await UserController.toggleUserStatus((await params).id));
  } catch (error) {
    return handleError(error);
  }
}
