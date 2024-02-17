import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RolesEnum } from "src/users/role.enum";
import { ROLES_KEY } from "./roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RolesEnum>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // console.log(requiredRoles);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();


    // si es administrador lo dejamos hacer lo que sea :D
// if (user.role === RolesEnum.ADMIN) return true;

    return user.role === requiredRoles;
  }
}
