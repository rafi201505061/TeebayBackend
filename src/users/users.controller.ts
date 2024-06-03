import {
  Controller,
  ForbiddenException,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ProductsService } from 'src/products/products.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly productService: ProductsService,
  ) {}

  @UseGuards(AuthGuard)
  @Get(':id/products')
  getProducts(
    @Param('id', ParseIntPipe) id: number,
    @Query('pageNo', ParseIntPipe) pageNo: number = 0,
    @Query('pageSize', ParseIntPipe) pageSize: number = 15,
    @Req() request: Request,
  ) {
    if (request['user'].sub !== id) {
      throw new ForbiddenException();
    }
    if (pageNo < 0)
      throw new HttpException(
        'Page no must be a number greater than or equal to 0',
        HttpStatus.BAD_REQUEST,
      );
    if (pageSize < 0 || pageSize > 100)
      throw new HttpException(
        'Page size must be a number between 0 to 100',
        HttpStatus.BAD_REQUEST,
      );
    return this.productService.findAll({ userId: id, pageNo, pageSize });
  }
}
