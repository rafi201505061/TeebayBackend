import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAcquisitionHistoryDto } from './dto/create-acquisition-history.dto';
import { UpdateAcquisitionHistoryDto } from './dto/update-acquisition-history.dto';
import { DatabaseService } from 'src/database/database.service';
import { ProductsService } from 'src/products/products.service';
import { AcquisitionFilterCriteria } from './dto/acquisition-filter-criteria.dto';

@Injectable()
export class AcquisitionHistoryService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly productService: ProductsService,
  ) {}
  async create(createAcquisitionHistoryDto: CreateAcquisitionHistoryDto) {
    try {
      await this.databaseService.$transaction(async () => {
        const product = await this.productService.findOneById(
          createAcquisitionHistoryDto.productId,
        );
        if (!product) throw new NotFoundException();
        if (!product.available)
          throw new HttpException(
            'Product not available to buy/borrow.',
            HttpStatus.CONFLICT,
          );
        if (product.ownerId === createAcquisitionHistoryDto.acquirerId)
          throw new HttpException(
            "You can't buy/borrow your own products.",
            HttpStatus.FORBIDDEN,
          );
        const data = await this.databaseService.acquisitionHistory.create({
          data: {
            acquisitionType: createAcquisitionHistoryDto.acquisitionType,
            product: { connect: { id: createAcquisitionHistoryDto.productId } },
            acquirer: {
              connect: { id: createAcquisitionHistoryDto.acquirerId },
            },
          },
        });
        await this.productService.updateAvailability(
          createAcquisitionHistoryDto.productId,
        );
        return data;
      });
    } catch (error) {
      throw error;
    }
    return createAcquisitionHistoryDto;
  }

  async findAll(searchCriteria: AcquisitionFilterCriteria) {
    const { pageNo, pageSize, acquisitionType, userId } = searchCriteria;
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
    return await this.databaseService.acquisitionHistory.findMany({
      skip: pageNo * pageSize,
      take: pageSize,
      where: {
        acquirerId: userId,
        acquisitionType,
      },
      orderBy: {
        acquiredAt: 'desc',
      },
      include: {
        product: {
          include: {
            categories: true,
          },
        },
      },
    });
  }

  async findAllProductsOfUser(searchCriteria: AcquisitionFilterCriteria) {
    const { pageNo, pageSize, acquisitionType, userId } = searchCriteria;
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
    return await this.databaseService.acquisitionHistory.findMany({
      skip: pageNo * pageSize,
      take: pageSize,
      where: {
        product: { ownerId: userId },
        acquisitionType,
      },
      orderBy: {
        acquiredAt: 'desc',
      },
      include: {
        product: {
          include: {
            categories: true,
          },
        },
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} acquisitionHistory`;
  }

  update(id: number, updateAcquisitionHistoryDto: UpdateAcquisitionHistoryDto) {
    console.log(updateAcquisitionHistoryDto);
    return `This action updates a #${id} acquisitionHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} acquisitionHistory`;
  }
}
