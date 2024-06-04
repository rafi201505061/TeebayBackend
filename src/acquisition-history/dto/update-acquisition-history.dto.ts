import { PartialType } from '@nestjs/mapped-types';
import { CreateAcquisitionHistoryDto } from './create-acquisition-history.dto';

export class UpdateAcquisitionHistoryDto extends PartialType(CreateAcquisitionHistoryDto) {}
