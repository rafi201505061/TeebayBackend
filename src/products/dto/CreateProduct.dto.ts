import { AcquisitionType, RentType } from '@prisma/client';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @Min(0)
  @IsOptional()
  price?: number;

  @Min(0)
  @IsOptional()
  rentPrice?: number;

  @IsEnum(RentType)
  @IsOptional()
  rentType?: RentType;

  @IsNumber()
  ownerId: number;

  @IsNumber({}, { each: true })
  @IsNotEmpty({ each: true })
  @IsArray()
  categories?: number[];

  listingType: AcquisitionType;
}
