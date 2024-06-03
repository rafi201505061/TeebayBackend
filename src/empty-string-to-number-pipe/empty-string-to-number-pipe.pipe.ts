import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class EmptyStringToNumberPipePipe implements PipeTransform {
  transform(value: any) {
    if (!value) {
      return 0;
    } else {
      return parseInt(value, 10);
    }
  }
}
