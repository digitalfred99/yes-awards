import { CustomAppError } from "@/lib/errors/customAppError";
import { ErrorCodes } from "@/lib/errors/errorCodes";
import { CreateUserDTO } from "@/types/user.type";

function fail(message: string): never {
  throw new CustomAppError( message, 400, ErrorCodes.VALIDATION_FAILED.code, ErrorCodes.VALIDATION_FAILED.label, "validation_failed" );
}

export function validateCreateUser(data: Record<string, unknown>): asserts data is CreateUserDTO {
  if (!data.firstName) fail("firstName is required");
  if (!data.lastName) fail("lastName is required");
  if (!data.password) fail("password is required");
  if (!data.gender) fail("gender is required");
  if (!data.role) fail("role is required");
  // if (!data.category) fail("category is required");
  // if (!data.interest) fail("interest is required");
  if (typeof data.phoneNumber !== "string" || !/^\d{10}$/.test(data.phoneNumber)) {
    fail("Invalid phone number. Should be exactly 10 digits");
  }
}

export function validateUserEnum(data: Record<string, unknown>): asserts data is CreateUserDTO {
  if (data.gender && (typeof data.gender !== "string" || !["MALE", "FEMALE"].includes(data.gender))) {
    fail("gender must be one of 'MALE', 'FEMALE'");
  }

  if (data.role && (typeof data.role !== "string" || !["NOMINEE", "ADMIN", "SUPER_ADMIN"].includes(data.role))) {
    fail("role must be one of 'NOMINEE', 'ADMIN', or 'SUPER_ADMIN'");
  }

  if (data.interest && (typeof data.interest !== "string" || !["EXPLORING", "COMMITTED", "HIGHLY_COMMITTED", "FULLY_COMMITTED"].includes(data.interest))) {
    fail("interest must be a valid commitment level");
  }
}

  export const validatePasswordStrength = (user: Record<string, unknown>) => {
    // const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const password = user.password;

    if (typeof password !== "string" || !password) {
      throw new CustomAppError("Password is required.", 400, ErrorCodes.VALIDATION_FAILED.code, ErrorCodes.VALIDATION_FAILED.label, "validation_failed");
    }
    if (password.length < 8) {
      throw new CustomAppError("Password must be at least 8 characters long.", 400, ErrorCodes.VALIDATION_FAILED.code, ErrorCodes.VALIDATION_FAILED.label, "validation_failed");
    }
    // if (!specialCharsRegex.test(password)) {
    //   throw new CustomAppError("Password must contain at least one special character.", 400, ErrorCodes.VALIDATION_FAILED.code, ErrorCodes.VALIDATION_FAILED.label, "validation_failed");
    // }
  };
