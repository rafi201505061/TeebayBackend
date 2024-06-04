import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Query,
  ParseIntPipe,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { AcquisitionHistoryService } from './acquisition-history.service';
import { CreateAcquisitionHistoryDto } from './dto/create-acquisition-history.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { AcquisitionType } from '@prisma/client';

@Controller('acquisitions')
export class AcquisitionHistoryController {
  constructor(
    private readonly acquisitionHistoryService: AcquisitionHistoryService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createAcquisitionHistoryDto: CreateAcquisitionHistoryDto) {
    return this.acquisitionHistoryService.create(createAcquisitionHistoryDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(
    @Query('acquisitionType') acquisitionType: AcquisitionType,
    @Query('pageNo') pageNo: string,
    @Query('pageSize') pageSize: string,
    @Query('userId', ParseIntPipe) userId: number,
    @Req() request: Request,
  ) {
    if (request['user'].sub !== userId) throw new ForbiddenException();
    return this.acquisitionHistoryService.findAll({
      acquisitionType,
      pageNo: Number.parseInt(pageNo),
      pageSize: Number.parseInt(pageSize),
      userId,
    });
  }

  @UseGuards(AuthGuard)
  @Get('uploaded-products')
  findAllUploadedProducts(
    @Query('acquisitionType') acquisitionType: AcquisitionType,
    @Query('pageNo') pageNo: string,
    @Query('pageSize') pageSize: string,
    @Query('ownerId', ParseIntPipe) ownerId: number,
    @Req() request: Request,
  ) {
    if (request['user'].sub !== ownerId) throw new ForbiddenException();
    return this.acquisitionHistoryService.findAllProductsOfUser({
      acquisitionType,
      pageNo: Number.parseInt(pageNo),
      pageSize: Number.parseInt(pageSize),
      userId: ownerId,
    });
  }
}
