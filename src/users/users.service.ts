import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}
  async create(createUserDto: Prisma.UserCreateInput) {
    return await this.databaseService.user.create({ data: createUserDto });
  }

  async findOneById(id: number) {
    return await this.databaseService.user.findUniqueOrThrow({ where: { id } });
  }
  async findOneByEmail(email: string) {
    return await this.databaseService.user.findUniqueOrThrow({
      where: { email },
    });
  }

  async update(id: number, updateUserDto: Prisma.UserUpdateInput) {
    return await this.databaseService.user.update({
      where: { id },
      data: updateUserDto,
    });
  }
}
