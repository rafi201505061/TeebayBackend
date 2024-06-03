import { UsersService } from './../users/users.service';
import {
  Body,
  ConflictException,
  Controller,
  NotFoundException,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { SignUpDto } from './dto/SignUpDto.dto';
import { v4 as uuidV4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/LogInDto.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
@Controller('')
export class AuthController {
  private saltRounds: number = 10;
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    try {
      await this.usersService.findOneByEmail(signUpDto.email);
      throw new ConflictException();
    } catch (error) {
      if (error.code === 'P2025') {
        const encryptedPassword = await bcrypt.hash(
          signUpDto.password,
          this.saltRounds,
        );
        const createUserDto = {
          userId: uuidV4(),
          firstName: signUpDto.firstName,
          lastName: signUpDto.lastName,
          email: signUpDto.email,
          phoneNo: signUpDto.phoneNo,
          encryptedPassword,
        };
        const newUser = await this.usersService.create(createUserDto);
        return newUser;
      } else {
        throw error;
      }
    }
  }

  @Post('log-in')
  async logIn(@Body() loginDto: LoginDto) {
    try {
      const user = await this.usersService.findOneByEmail(loginDto.email);
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
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException();
      } else {
        throw error;
      }
    }
  }

  @UseGuards(AuthGuard)
  @Post('validate-jwt-token')
  async validateJwtToken() {
    return 'Valid JWT Token';
  }
}
