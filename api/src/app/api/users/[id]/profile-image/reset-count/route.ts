import { NextRequest } from "next/server";
import { handleError, ok } from "@/lib/errors/globalError";
import { UserController } from "@/modules/user/user.controller";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(_request: NextRequest, { params }: RouteContext) {
  try {
    return ok(await UserController.resetProfileChangeCount((await params).id));
  } catch (error) {
    return handleError(error);
  }
}