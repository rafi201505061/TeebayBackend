import { Module } from '@nestjs/common';
import { AcquisitionHistoryService } from './acquisition-history.service';
import { AcquisitionHistoryController } from './acquisition-history.controller';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [ProductsModule],
  controllers: [AcquisitionHistoryController],
  providers: [AcquisitionHistoryService],
})
export class AcquisitionHistoryModule {}
