import { RolesEnum } from "../role.enum";

export class CreateUserDto {
    name: string;
    email: string;
    password: string;
    role: RolesEnum;  
    telefono: string;  
  }
  