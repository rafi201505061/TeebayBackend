import {
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
import { AcquisitionType } from '@prisma/client';

@Injectable()
export class AcquisitionHistoryService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly productService: ProductsService,
  ) {}
  async create(createAcquisitionHistoryDto: CreateAcquisitionHistoryDto) {
    try {
      return await this.databaseService.$transaction(async () => {
        if (
          createAcquisitionHistoryDto.acquisitionType ===
            AcquisitionType.RENT &&
          createAcquisitionHistoryDto.acquisitionStart >=
            createAcquisitionHistoryDto.acquisitionEnd
        )
          throw new HttpException(
            'Acquisition range not valid.',
            HttpStatus.BAD_REQUEST,
          );
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
        if (product.version !== createAcquisitionHistoryDto.version)
          throw new HttpException(
            'Product not available to buy/borrow.',
            HttpStatus.CONFLICT,
          );
        if (
          createAcquisitionHistoryDto.acquisitionType === AcquisitionType.RENT
        ) {
          const rentHistory = await this.findRentHistoryOfProduct(
            createAcquisitionHistoryDto.productId,
            createAcquisitionHistoryDto.acquisitionStart,
          );
          const acquisitionStartTime =
            createAcquisitionHistoryDto.acquisitionStart;
          const acquisitionEndTime = createAcquisitionHistoryDto.acquisitionEnd;

          if (
            rentHistory.some(
              (item) =>
                (acquisitionStartTime >= item.acquisitionStart &&
                  acquisitionStartTime < item.acquisitionEnd) ||
                (acquisitionEndTime >= item.acquisitionStart &&
                  acquisitionEndTime < item.acquisitionEnd),
            )
          ) {
            throw new HttpException(
              'Conflict with existing borrow slot.',
              HttpStatus.CONFLICT,
            );
          }
        }

        await this.databaseService.acquisitionHistory.create({
          data: {
            acquisitionType: createAcquisitionHistoryDto.acquisitionType,
            product: {
              connect: {
                id: createAcquisitionHistoryDto.productId,
                version: createAcquisitionHistoryDto.version,
              },
            },
            acquirer: {
              connect: { id: createAcquisitionHistoryDto.acquirerId },
            },
          },
        });
        const data = await this.productService.updateAvailability(
          createAcquisitionHistoryDto.productId,
          createAcquisitionHistoryDto.version + 1,
        );
        return data;
      });
    } catch (error) {
      throw error;
    }
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

  async findRentHistoryOfProduct(id: number, startTime: number) {
    return await this.databaseService.acquisitionHistory.findMany({
      where: {
        product: { id },
        acquisitionType: AcquisitionType.RENT,
        acquisitionStart: { gte: startTime },
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
