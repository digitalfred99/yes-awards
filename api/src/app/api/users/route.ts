import { NextRequest } from "next/server";
import { UserController } from "@/modules/user/user.controller";
import { handleError, ok } from "@/lib/errors/globalError";
import type { FilterUserDTO } from "@/types/user.type";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const filters: FilterUserDTO = {
      firstName: params.get("firstName") ?? undefined,
      lastName: params.get("lastName") ?? undefined,
      phoneNumber: params.get("phoneNumber") ?? undefined,
      gender: (params.get("gender") as FilterUserDTO["gender"]) ?? undefined,
      role: (params.get("role") as FilterUserDTO["role"]) ?? undefined,
      category: params.get("category") ?? undefined,
      nomineeCode: params.get("nomineeCode") ?? undefined,
      status: (params.get("status") as FilterUserDTO["status"]) ?? undefined,
      isActive: params.has("isActive") ? params.get("isActive") === "true" : undefined,
    };
    return ok(await UserController.getUsers(filters));
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    return ok(await UserController.createUser(await request.json()), 201);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { ids } = await request.json();
    return ok(await UserController.deleteUsers(ids));
  } catch (error) {
    return handleError(error);
  }
}
