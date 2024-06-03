import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { v4 as uuidV4 } from 'uuid';
import { CreateProductDto } from './dto/CreateProduct.dto';
import { UpdateProductDto } from './dto/UpdateProduct.dto';

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
    return await this.databaseService.product.findUnique({
      where: { productId },
    });
  }

  async findOneById(id: number) {
    return await this.databaseService.product.findUnique({
      where: { id },
    });
  }

  async update(
    ownerId: number,
    id: number,
    updateProductDto: UpdateProductDto,
  ) {
    const product = await this.findOneById(id);
    if (!product)
      throw new HttpException('Product not found!', HttpStatus.NOT_FOUND);

    if (product.ownerId !== ownerId) {
      throw new HttpException(
        'You are not allowed to perform this action.',
        HttpStatus.FORBIDDEN,
      );
    }
    return await this.databaseService.product.update({
      where: { id },
      data: {
        ...updateProductDto,
        categories: {
          set: (updateProductDto.categories ?? []).map((id) => ({ id })),
        },
      },
    });
  }

  async remove(productId: string) {
    return await this.databaseService.product.delete({ where: { productId } });
  }
}
