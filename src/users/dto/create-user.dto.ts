import { IsEmail, isEmail } from "class-validator";
import { RolesEnum } from "../role.enum";

export class CreateUserDto {
  name: string;
  @IsEmail()
    email: string;
    password: string;
    role: RolesEnum;  
    telefono: string;  
  }
  