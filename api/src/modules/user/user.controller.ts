import { UserService } from "./user.service";
import type { CreateUserDTO, UpdateUserDTO, FilterUserDTO } from "@/types/user.type";
import type { ImageFileInput } from "@/lib/storage/createWithImages";

export class UserController {
  static async getUsers(data: FilterUserDTO) {
    return await UserService.getUsers(data);
  }

  static async getUser(id: string) {
    return await UserService.getUser(id);
  }

  static async createUser(data: CreateUserDTO) {
    return await UserService.create(data);
  }

  static async updateUser(id: string, data: UpdateUserDTO) {
    return await UserService.update(id, data)
  }

  static async toggleUserStatus(id: string) {
    return await UserService.toggleUserStatus(id);
  }

  static async updateProfileImage(id: string, image: ImageFileInput) {
    return await UserService.updateProfileImage(id, image);
  }

  static async resetProfileChangeCount(id: string) {
    return await UserService.resetProfileChangeCount(id);
  }
  
  static async deleteUsers(ids: string[]) {
    return await UserService.delete(ids);
  }
}
