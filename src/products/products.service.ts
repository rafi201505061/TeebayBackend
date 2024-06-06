import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { v4 as uuidV4 } from 'uuid';
import { CreateProductDto } from './dto/CreateProduct.dto';
import { UpdateProductDto } from './dto/UpdateProduct.dto';
import { ProductFilterCriteria } from './utils/ProductFilterCriteria';
@Injectable()
export class ProductsService {
  constructor(private readonly databaseService: DatabaseService) {}
  async create(createProductDto: CreateProductDto) {
    return await this.databaseService.product.create({
      include: { categories: true },
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

  async findAll(filterOptions: ProductFilterCriteria) {
    const {
      pageNo,
      pageSize,
      categoryId,
      minPrice,
      maxPrice,
      userId,
      available,
      acquisitionType,
      rentType,
    } = filterOptions;
    if (Number.isNaN(pageNo) || pageNo < 0) {
      throw new HttpException(
        'Page no must be a number greater than or equal to 0.',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (Number.isNaN(pageSize) || pageSize < 0 || pageSize > 100) {
      throw new HttpException(
        'Page size must be a number between 0 to 100.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const isMinPriceValid = !(Number.isNaN(minPrice) || minPrice < 0);
    const isMaxPriceValid = !(Number.isNaN(maxPrice) || maxPrice < 0);
    if (!Number.isNaN(minPrice) && minPrice < 0) {
      throw new HttpException(
        'Minimum price must be a number greater than or equal to 0.',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (Number.isNaN(maxPrice) && maxPrice < 0) {
      throw new HttpException(
        'Maximum price must be a number greater than or equal to 0.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.databaseService.product.findMany({
      skip: pageNo * pageSize,
      take: pageSize,
      where: {
        title: { mode: 'insensitive', contains: filterOptions.title },
        ...(available !== undefined ? { available } : {}),
        ...(categoryId
          ? {
              categories: {
                some: {
                  id: categoryId,
                },
              },
            }
          : {}),

        ...(userId ? { ownerId: userId } : {}),
        ...(acquisitionType === 'BUY' && (isMinPriceValid || isMaxPriceValid)
          ? {
              price: {
                ...(isMinPriceValid ? { gte: minPrice } : {}),
                ...(isMaxPriceValid ? { lte: maxPrice } : {}),
              },
            }
          : {}),
        ...(acquisitionType === 'RENT' && (isMinPriceValid || isMaxPriceValid)
          ? {
              rentPrice: {
                ...(isMinPriceValid ? { gte: minPrice } : {}),
                ...(isMaxPriceValid ? { lte: maxPrice } : {}),
              },
              rentType,
            }
          : {}),
        deleted: false,
        ...(acquisitionType ? { listingType: acquisitionType } : {}),
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        categories: true,
      },
    });
  }

  async findOneByProductId(productId: string) {
    const product = await this.databaseService.product.findUnique({
      where: { productId, deleted: false },
      include: { categories: true },
    });
    if (!product)
      throw new HttpException('Product not found!', HttpStatus.NOT_FOUND);
    return product;
  }

  async findOneById(id: number) {
    return await this.databaseService.product.findUnique({
      where: { id, deleted: false },
    });
  }

  async validateOwnerShip(id: number, ownerId: number) {
    const product = await this.findOneById(id);
    if (!product)
      throw new HttpException('Product not found!', HttpStatus.NOT_FOUND);

    if (product.ownerId !== ownerId) {
      throw new HttpException(
        'You are not allowed to perform this action.',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async update(
    ownerId: number,
    id: number,
    updateProductDto: UpdateProductDto,
  ) {
    await this.validateOwnerShip(id, ownerId);
    return await this.databaseService.product.update({
      include: { categories: true },
      where: { id, deleted: false },
      data: {
        ...updateProductDto,
        categories: {
          set: (updateProductDto.categories ?? []).map((id) => ({ id })),
        },
      },
    });
  }

  async updateViewCount(id: number) {
    const product = await this.findOneById(id);
    if (!product) throw new NotFoundException();
    return await this.databaseService.product.update({
      where: { id, deleted: false },
      data: { views: product.views + 1 },
    });
  }
  async remove(ownerId: number, id: number) {
    await this.validateOwnerShip(id, ownerId);
    return await this.databaseService.product.update({
      where: { id, deleted: false },
      data: { deleted: true },
    });
  }

  async updateAvailability(id: number, version: number) {
    return await this.databaseService.product.update({
      where: { id, deleted: false },
      data: { available: false, version },
    });
  }
}
