import { Controller, Get, Post, Body, Patch, Param, UseGuards, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesEnum } from './role.enum';
import { AuthRolesGuard } from 'src/auth/auth_roles.guard';
import { IUserSimple } from './IUserSimple.interface';

@Controller('users')
@AuthRolesGuard(RolesEnum.ADMIN)
export class UsersController {

  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user: IUserSimple = await this.usersService.findOneById(+id);
    return user;
  }

  @Patch()
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  // @Post('simple')
  // updateSimple(@Body() updateUserDto) {
  //   return this.usersService.update(updateUserDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  
}