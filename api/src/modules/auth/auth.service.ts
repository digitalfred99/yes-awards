import { LoginDTO } from "@/types/auth";
import { AppDataSource } from "../../database/data-source";
import { User, UserStatus } from "../../database/entities/User";
import { CustomAppError } from "@/lib/errors/customAppError";
import { ErrorCodes } from "@/lib/errors/errorCodes";

export class AuthService {
  private static async repo() {
    const db = await AppDataSource();
    return db.getRepository(User);
  }

  static async login(data: LoginDTO) {
    const repo = await this.repo();

    if (!data.phoneNumber) throw new CustomAppError( "Phone number is required", 401, ErrorCodes.VALIDATION_FAILED.code, ErrorCodes.VALIDATION_FAILED.label, "unauthorized" );
    if (!data.password) throw new CustomAppError( "Password is required", 401, ErrorCodes.VALIDATION_FAILED.code, ErrorCodes.VALIDATION_FAILED.label, "unauthorized" );

    const user = await repo.findOne({
      where: { phoneNumber: data.phoneNumber, isDeleted: false },
    });

    if (!user) {
      throw new CustomAppError( "Invalid phone number or password", 401, ErrorCodes.INVALID_CREDENTIALS.code, ErrorCodes.INVALID_CREDENTIALS.label, "unauthorized" );
    }

    if (!user.isActive || user.status === UserStatus.INACTIVE) {
      throw new CustomAppError( "This account is inactive or has been deactivated", 403, ErrorCodes.ACCOUNT_INACTIVE.code, ErrorCodes.ACCOUNT_INACTIVE.label, "forbidden" );
    }

    const passwordMatches = user.password === data.password;

    if (!passwordMatches) {
      throw new CustomAppError( "Invalid phone number or password", 401, ErrorCodes.INVALID_CREDENTIALS.code, ErrorCodes.INVALID_CREDENTIALS.label, "unauthorized" );
    }

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    };
  }
}
