import { LoginDTO } from "@/types/auth";
import { AuthService } from "./auth.service";

export class AuthController {
  static async login(data: LoginDTO) {
    return await AuthService.login(data);
  }
}