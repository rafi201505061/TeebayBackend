import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { SignUpDto } from 'src/auth/dto/SignUpDto.dto';
import { DatabaseService } from 'src/database/database.service';
import { v4 as uuidV4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { authConstants } from 'src/auth/authConstants';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}
  async create(signUpDto: SignUpDto) {
    const user = await this.findOneByEmail(signUpDto.email);
    if (user)
      throw new HttpException(
        'User already exists. Please sign in.',
        HttpStatus.CONFLICT,
      );
    const encryptedPassword = await bcrypt.hash(
      signUpDto.password,
      authConstants.bcryptPasswordSaltRounds,
    );
    const createUserDto = {
      userId: uuidV4(),
      firstName: signUpDto.firstName,
      lastName: signUpDto.lastName,
      email: signUpDto.email,
      phoneNo: signUpDto.phoneNo,
      encryptedPassword,
    };
    return await this.databaseService.user.create({ data: createUserDto });
  }

  async findOneById(id: number) {
    const user = await this.databaseService.user.findUnique({ where: { id } });
    return user;
  }
  async findOneByEmail(email: string) {
    const user = await this.databaseService.user.findUnique({
      where: { email },
    });
    return user;
  }

  async update(id: number, updateUserDto: Prisma.UserUpdateInput) {
    const user = await this.findOneById(id);
    if (!user) {
      new HttpException('User not found!', HttpStatus.NOT_FOUND);
    }
    if (updateUserDto.email) {
      const user = this.findOneByEmail(updateUserDto.email as string);
      if (user)
        throw new HttpException('Email already taken', HttpStatus.CONFLICT);
    }
    return await this.databaseService.user.update({
      where: { id },
      data: updateUserDto,
    });
  }
}
