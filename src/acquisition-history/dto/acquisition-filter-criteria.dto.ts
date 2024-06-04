import { AcquisitionType } from '@prisma/client';

export class AcquisitionFilterCriteria {
  acquisitionType: AcquisitionType;
  pageNo: number;
  pageSize: number;
  userId: number;
}
