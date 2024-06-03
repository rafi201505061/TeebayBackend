import { RentType } from '@prisma/client';
import { IsArray, IsEnum, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @Min(0)
  price: number;

  @Min(0)
  rentPrice: number;

  @IsEnum(RentType)
  rentType: RentType;

  @IsNumber()
  ownerId: number;

  @IsNumber({}, { each: true })
  @IsNotEmpty({ each: true })
  @IsArray()
  categories?: number[];
}
