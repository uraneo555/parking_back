import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { RegisterDto } from './register.dto';
import { LoginDto } from './login.dto';
import { AuthService } from './auth.service';



@Controller('auth')
export class AuthController {
  constructor(private readonly auth2020Service: AuthService) { }


  @Post("register")
  register(@Body() registerDto: RegisterDto) {
    return this.auth2020Service.register(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post("login")
  login(@Body() loginDto: LoginDto) {
    return this.auth2020Service.login(loginDto);
  }



}
