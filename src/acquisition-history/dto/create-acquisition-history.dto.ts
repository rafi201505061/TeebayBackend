import { AcquisitionType } from '@prisma/client';

export class CreateAcquisitionHistoryDto {
  acquisitionType: AcquisitionType;
  productId: number;
  acquirerId: number;
  acquisitionStart?: number;
  acquisitionEnd?: number;
  version: number;
}
