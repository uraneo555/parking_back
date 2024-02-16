import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import * as bcryptjs from "bcryptjs";

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User)
    private readonly repositoryModel: typeof User,
  ) { }

  async findOneById(id: number) {
    const user = await this.repositoryModel.findByPk(id)
    return this.getUserSinPassword(user);
  }

  async findOne(id: number) {
    return this.getUserSinPassword(await this.repositoryModel.findByPk(id));
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

  async findOneByEmail(email: string) {
    return await this.repositoryModel.findOne({
      where: {
        email
      }
    });
  }

  async getUserByName(name: string) {
    return await this.repositoryModel.findOne({
      where: {
        name
      }
    });
  }

  async findOneByEmailWithPassword(email: string) {
    return await this.repositoryModel.findOne({
      where: { email }
    });
  }

  async update(updateDto: UpdateUserDto) {
    try {
      let userDB = await this.repositoryModel.findByPk(updateDto.id);
      if (userDB) {
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

        return userDB;
      } else {
        throw new BadRequestException(`No existe un usuario de id ${updateDto.id}`)
      }
    } catch (error) {
      if (error.original.code === "23505") {
        throw new BadRequestException(error.original.detail)
      } else {
        console.log(error);
      }
    }
  }

  async remove(id: number) {
    const user = await this.repositoryModel.findByPk(id);
    if (user) {
      return await user.destroy();
    } else {
      throw new BadRequestException(`no existe usuario con id ${id}`)
    }
  }


}
