import { NextRequest } from "next/server";
import { UserController } from "@/modules/user/user.controller";
import { handleError, ok } from "@/lib/errors/globalError";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    return ok(await UserController.getUser((await params).id));
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    return ok(await UserController.updateUser((await params).id, await request.json()));
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    return ok(await UserController.deleteUsers([(await params).id]));
  } catch (error) {
    return handleError(error);
  }
}
