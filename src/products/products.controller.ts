import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Put,
  ParseIntPipe,
  Req,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateProductDto } from './dto/CreateProduct.dto';
import { UpdateProductDto } from './dto/UpdateProduct.dto';
import { AcquisitionType, RentType } from '@prisma/client';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Post()
  create(@Body() createProductDto: CreateProductDto, @Req() request: Request) {
    if (request['user'].sub !== createProductDto.ownerId) {
      throw new HttpException('Forbidden!', HttpStatus.FORBIDDEN);
    }
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(
    @Query('pageNo') pageNo: string = '0',
    @Query('pageSize') pageSize: string = '15',
    @Query('categoryId') categoryId: string,
    @Query('acquisitionType') acquisitionType: AcquisitionType,
    @Query('minPrice') minPrice: string,
    @Query('maxPrice') maxPrice: string,
    @Query('title') title: string,
    @Query('rentType') rentType: RentType,
  ) {
    return this.productsService.findAll({
      pageNo: Number.parseInt(pageNo),
      pageSize: Number.parseInt(pageSize),
      categoryId: Number.parseInt(categoryId),
      minPrice: Number.parseFloat(minPrice),
      maxPrice: Number.parseFloat(maxPrice),
      available: true,
      acquisitionType,
      rentType,
      title,
    });
  }

  @Get(':id')
  findOne(@Param('id') productId: string) {
    return this.productsService.findOneByProductId(productId);
  }

  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
    @Req() request: Request,
  ) {
    return this.productsService.update(
      request['user'].sub,
      id,
      updateProductDto,
    );
  }

  @Put(':id/view-count')
  updateViewCount(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.updateViewCount(id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
    return this.productsService.remove(request['user'].sub, id);
  }
}
