import { SetMetadata } from "@nestjs/common";
import { RolesEnum } from "src/users/role.enum";

export const ROLES_KEY = "roles";
export const RolesDecorator = (role: RolesEnum) => SetMetadata(ROLES_KEY, role);