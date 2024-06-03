import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { v4 as uuidV4 } from 'uuid';
import { CreateProductDto } from './dto/CreateProduct.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly databaseService: DatabaseService) {}
  async create(createProductDto: CreateProductDto) {
    return await this.databaseService.product.create({
      data: {
        productId: uuidV4(),
        ...createProductDto,
        categories: {
          connect: createProductDto.categories.map((id) => ({
            id,
          })),
        },
      },
    });
  }

  async findAll() {
    return await this.databaseService.product.findMany();
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
