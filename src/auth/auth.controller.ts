import { UsersService } from './../users/users.service';
import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SignUpDto } from './dto/SignUpDto.dto';
import { LoginDto } from './dto/LogInDto.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import * as bcrypt from 'bcrypt';

@Controller('')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  @Post('sign-up')
  @UsePipes(ValidationPipe)
  async signUp(@Body() signUpDto: SignUpDto) {
    const user = await this.usersService.create(signUpDto);
    delete user.encryptedPassword;
    return user;
  }

  @HttpCode(HttpStatus.OK)
  @Post('log-in')
  @UsePipes(ValidationPipe)
  async logIn(@Body() loginDto: LoginDto) {
    const user = await this.usersService.findOneByEmail(loginDto.email);
    if (!user) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    }
    const isMatch = await bcrypt.compare(
      loginDto.password,
      user?.encryptedPassword,
    );

    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, email: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user,
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post('validate-jwt-token')
  async validateJwtToken(@Req() request: Request) {
    const user = await this.usersService.findOneById(request['user'].sub);
    delete user.encryptedPassword;
    return user;
  }
}
