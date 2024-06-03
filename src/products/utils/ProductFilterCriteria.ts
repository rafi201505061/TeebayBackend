import { IsNumber, Max, Min } from 'class-validator';

export class ProductFilterCriteria {
  @IsNumber()
  @Min(0)
  pageNo: number;

  @IsNumber()
  @Min(1)
  @Max(100)
  pageSize: number;

  @IsNumber()
  @Min(1)
  categoryId?: number;

  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @IsNumber()
  userId?: number;

  available?: boolean;
}
