import { RentType } from '@prisma/client';

export class UpdateProductDto {
  title?: string;
  description?: string;
  price?: number;
  rentPrice?: number;
  rentType?: RentType;
  categories?: number[] = [];
}
