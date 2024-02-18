import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import * as bcryptjs from "bcryptjs";
import { DatoResult } from "src/utiles/dato_result.class";

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User)
    private readonly repositoryModel: typeof User,
  ) { }

  // async findOneById(id: number) {
  //   const user = await this.repositoryModel.findByPk(id)
  //   return this.getUserSinPassword(user);
  // }

  async findOneById(id: number) {
    const user = await this.repositoryModel.findByPk(id)
    this.excepSiNoExisteUsuario(user, 'id', id)
    return this.getUserSinPassword(user);
  }

  async findAll() {
    let users = await this.repositoryModel.findAll();
    users.forEach((value) => {
      value.password = "-X-X-"
    })
    return users;
  }

  async create(createUserDto: CreateUserDto) {
    createUserDto.password = await bcryptjs.hash(createUserDto.password, 10);
    const newUser = await this.repositoryModel.create(createUserDto);
    return this.getUserSinPassword(newUser);
  }

  private getUserSinPassword(newUser: User) {
    const { password, ...result } = newUser['dataValues'];
    return result;
  }

  async findOneByEmail(email: string) {// no lo cambies asi esta perfecto
    return await this.repositoryModel.findOne({where: { email }});
  }

  async update(updateDto: UpdateUserDto) {

    
      let userDB = await this.repositoryModel.findByPk(updateDto.id);
      this.excepSiNoExisteUsuario(userDB, 'id', updateDto.id)

      if (updateDto.password != undefined) {
        updateDto.password = await bcryptjs.hash(updateDto.password, 10);
      }
      else {
        updateDto.password = userDB.password;
      }
      if (updateDto.email == undefined) {
        updateDto.email = userDB.email;
      }
      if (updateDto.name == undefined) {
        updateDto.name = userDB.name;
      }
      if (updateDto.role == undefined) {
        updateDto.role = userDB.role;
      }
      if (updateDto.telefono == undefined) {
        updateDto.telefono = userDB.telefono;
      }

      userDB = (await this.repositoryModel.upsert(updateDto))[0];

      return this.getUserSinPassword(userDB);
    }

  async remove(id: number) {
    let user = await this.repositoryModel.findByPk(id);
    this.excepSiNoExisteUsuario(user, 'id', id)
    await user.destroy();
    const result:DatoResult = new DatoResult();
    result.dato = this.getUserSinPassword(user);
    result.message = "Usuario eliminado satisfactoriamente.";
    return result
  }

  excepSiNoExisteUsuario(user: User, arg1: string, value: any) {
    if (!user) {
      throw new BadRequestException(`No existe usuario con ${arg1} ${value}`)
    }
  }


}
