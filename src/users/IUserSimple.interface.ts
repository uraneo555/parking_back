import { RolesEnum } from "./role.enum";

export interface IUserSimple {
    name: string;
    email: string;
    role: RolesEnum;  
    telefono: string;  
}
