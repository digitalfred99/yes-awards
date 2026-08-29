import { validateCreateUser, validatePasswordStrength, validateUserEnum } from "@/modules/user/user.validator";
import { validate as isUUID } from "uuid";
import { FindOptionsWhere, ILike, In } from "typeorm";
import { AppDataSource } from "@/database/data-source";
import { Gender, User, UserRole, UserStatus } from "@/database/entities/User";
import { CreateUserDTO, FilterUserDTO, UpdateUserDTO } from "@/types/user.type";
import { CustomAppError } from "@/lib/errors/customAppError";
import { ErrorCodes } from "@/lib/errors/errorCodes";
import { UserSanitizer } from "./user.sanitizer";
import { createWithImages, type ImageFileInput } from "@/lib/storage/createWithImages";

export class UserService {

  private static withoutPassword(user: User) {
    const { password: _password, ...safeUser } = user;
    return safeUser;
  }

  private static async repo() {
    const db = await AppDataSource();
    return db.getRepository(User);
  }

  static async getUsers(filters: FilterUserDTO) {
    const repo = await this.repo();

    const where: FindOptionsWhere<User> = { isDeleted: false };
    
    if (filters.firstName) where.firstName = ILike(`%${filters.firstName}%`);
    if (filters.lastName) where.lastName = ILike(`%${filters.lastName}%`);
    if (filters.phoneNumber) where.phoneNumber = ILike(`%${filters.phoneNumber}%`);
    if (filters.gender) where.gender = filters.gender as Gender;
    if (filters.role) where.role = filters.role as UserRole;
    if (filters.category) where.category = ILike(`%${filters.category}%`);
    if (filters.status) where.status = filters.status as UserStatus;
    if (filters.isActive !== undefined) where.isActive = filters.isActive;

    const [users, count] = await repo.findAndCount({
      where,
      order: { createdAt: "DESC" },
    });

    return { users: users.map(this.withoutPassword), count };
  }

  static async getUser(id: string) {
    if (!id || !isUUID(id)) {
      throw new CustomAppError("Valid User ID is required", 400, ErrorCodes.ID_REQUIRED.code, ErrorCodes.ID_REQUIRED.label, "bad_request");
    }

    const repo = await this.repo();

    const user = await repo.findOne({
      where: { id, isDeleted: false },
    });

    if (!user) {
      throw new CustomAppError("No user found with the given ID", 404, ErrorCodes.USER_NOT_FOUND.code, ErrorCodes.USER_NOT_FOUND.label, "user_not_found");
    }

    return this.withoutPassword(user);
  }

  static async create(data: CreateUserDTO) {
    const repo = await this.repo();
    const safeData = UserSanitizer.create(data);
    validateCreateUser(safeData);
    validateUserEnum(safeData);
    validatePasswordStrength(safeData);

    const existingUser = await repo.findOne({
      where: { phoneNumber: safeData.phoneNumber, isDeleted: false },
    });

    if (existingUser) {
      throw new CustomAppError("User with this phone number already exists", 400, ErrorCodes.RECORD_ALREADY_EXISTS.code, ErrorCodes.RECORD_ALREADY_EXISTS.label, "user_exists");
    }

    const newUser = repo.create({
      firstName: safeData.firstName,
      lastName: safeData.lastName,
      nickName: safeData.nickName,
      phoneNumber: safeData.phoneNumber,
      gender: safeData.gender,
      role: safeData.role,
      category: safeData.category,
      interest: safeData.interest,
      password: safeData.password,
    });

    return this.withoutPassword(await repo.save(newUser));
  }

  static async update(id: string, data: UpdateUserDTO) {
    if (!id || !isUUID(id)) {
      throw new CustomAppError("Valid User ID is required", 400, ErrorCodes.ID_REQUIRED.code, ErrorCodes.ID_REQUIRED.label, "bad_request");
    }

    const safeData = UserSanitizer.update(data);
    validateUserEnum(safeData);

    const repo = await this.repo();

    const existingUser = await repo.findOne({ where: { id, isDeleted: false } });
    if (!existingUser) {
      throw new CustomAppError("No user found with the given ID", 404, ErrorCodes.USER_NOT_FOUND.code, ErrorCodes.USER_NOT_FOUND.label, "user_not_found");
    }

    if (safeData.phoneNumber) {
      const duplicateUser = await repo.findOne({
        where: { phoneNumber: safeData.phoneNumber, isDeleted: false },
      });
      if (duplicateUser && duplicateUser.id !== id) {
        throw new CustomAppError("User with this phone number already exists", 400, ErrorCodes.RECORD_ALREADY_EXISTS.code, ErrorCodes.RECORD_ALREADY_EXISTS.label, "user_exists");
      }
    }

    if (safeData.password) {
      validatePasswordStrength(safeData);
    }

    const updatedUser = repo.merge(existingUser, safeData);
    return this.withoutPassword(await repo.save(updatedUser));
  }

  static async updateProfileImage(id: string, image: ImageFileInput) {
    if (!id || !isUUID(id)) {
      throw new CustomAppError("Valid User ID is required", 400, ErrorCodes.ID_REQUIRED.code, ErrorCodes.ID_REQUIRED.label, "bad_request");
    }

    const repo = await this.repo();
    const user = await repo.findOne({ where: { id, isDeleted: false } });
    if (!user) {
      throw new CustomAppError("No user found with the given ID", 404, ErrorCodes.USER_NOT_FOUND.code, ErrorCodes.USER_NOT_FOUND.label, "user_not_found");
    }

    if (user.profileChangeCount >= 3) {
      throw new CustomAppError("Profile image can only be changed 3 times", 400, ErrorCodes.INVALID_STATE.code, ErrorCodes.INVALID_STATE.label, "profile_image_change_limit_reached");
    }

    return createWithImages(image, async ({ profileImage }) => {
      user.profileImage = profileImage;
      user.profileChangeCount += 1;
      return this.withoutPassword(await repo.save(user));
    }, { folder: "profiles" });
  }

  static async resetProfileChangeCount(id: string) {
    if (!id || !isUUID(id)) {
      throw new CustomAppError("Valid User ID is required", 400, ErrorCodes.ID_REQUIRED.code, ErrorCodes.ID_REQUIRED.label, "bad_request");
    }

    const repo = await this.repo();
    const user = await repo.findOne({ where: { id, isDeleted: false } });
    if (!user) {
      throw new CustomAppError("No user found with the given ID", 404, ErrorCodes.USER_NOT_FOUND.code, ErrorCodes.USER_NOT_FOUND.label, "user_not_found");
    }

    user.profileChangeCount = 0;
    return this.withoutPassword(await repo.save(user));
  }

  static async toggleUserStatus(id: string) {
    if (!id || !isUUID(id)) {
      throw new CustomAppError("Valid User ID is required", 400, ErrorCodes.ID_REQUIRED.code, ErrorCodes.ID_REQUIRED.label, "bad_request");
    }

    const repo = await this.repo();

    const user = await repo.findOne({ where: { id, isDeleted: false } });

    if (!user) {
      throw new CustomAppError("No user found with the given ID", 404, ErrorCodes.USER_NOT_FOUND.code, ErrorCodes.USER_NOT_FOUND.label, "user_not_found");
    }

    const newStatus = user.status === UserStatus.ACTIVE ? UserStatus.INACTIVE : UserStatus.ACTIVE;
    user.status = newStatus;
    return this.withoutPassword(await repo.save(user));
  }

  static async delete(ids: string[]) {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new CustomAppError("Invalid request IDs", 400, ErrorCodes.ID_REQUIRED.code, ErrorCodes.ID_REQUIRED.label, "bad_request");
    }

    const repo = await this.repo();

    const records = await repo.find({
      where: { id: In(ids), isDeleted: false },
    });

    if (records.length === 0) {
      throw new CustomAppError("No matching records found to delete", 404, ErrorCodes.RECORD_NOT_FOUND.code, ErrorCodes.RECORD_NOT_FOUND.label, "not_found");
    }

    records.forEach(record => {
      record.isDeleted = true;
    });

    return repo.save(records);
  }
}
