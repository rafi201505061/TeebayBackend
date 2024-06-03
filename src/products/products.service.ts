import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ProductsService {
  constructor(private readonly databaseService: DatabaseService) {}
  async create(createProductDto: Prisma.ProductCreateInput) {
    return await this.databaseService.product.create({
      data: createProductDto,
    });
  }

  findAll() {
    return `This action returns all products`;
  }

  async findOneByProductId(productId: string) {
    return await this.databaseService.product.findUniqueOrThrow({
      where: { productId },
    });
  }

  async update(productId: string, updateProductDto: Prisma.ProductUpdateInput) {
    return await this.databaseService.product.update({
      where: { productId },
      data: updateProductDto,
    });
  }

  async remove(productId: string) {
    return await this.databaseService.product.delete({ where: { productId } });
  }
}
