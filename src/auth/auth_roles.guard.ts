import { applyDecorators, UseGuards } from "@nestjs/common";
import { RolesEnum } from "src/users/role.enum";
import { RolesGuard } from "./roles.guard";
import { RolesDecorator } from "./roles.decorator";
import { AuthGuard } from "./auth.guard";

export function AuthRolesGuard(role: RolesEnum) {
  return applyDecorators(RolesDecorator(role), UseGuards(AuthGuard, RolesGuard));
}
