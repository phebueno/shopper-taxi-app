import { PipeTransform } from '@nestjs/common';

export class ParseToStringPipe implements PipeTransform {
  transform(value: any): string {
    return String(value).trim();
  }
}
