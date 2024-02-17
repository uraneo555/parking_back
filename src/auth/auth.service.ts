import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './register.dto';
import { LoginDto } from './login.dto';
import * as bcryptjs from "bcryptjs";

@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) { }

  async validateUser(username: string, pass: string) {
    const user = await this.usersService.findOneByEmail(username);
    if (!user) {
      return null;
    }
  }

  async register(create: RegisterDto) {

    const user = await this.usersService.findOneByEmail(create.email);

    if (user) {
      throw new BadRequestException("Email already exists");
    }

    let newUser = await this.usersService.create(create);

    return {
      message: "User created successfully",
      newUser
    };
  }

  async login({ email, password }: LoginDto) {

    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException("Invalid email");
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid password");
    }

    const payload = { email: user.email, role: user.role };


    const token = await this.jwtService.signAsync(payload);

    return {
      email: user.email,
      token
    };
  }

}
