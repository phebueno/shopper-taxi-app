import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class CustomParseIntPipe implements PipeTransform {
  transform(value: string | undefined): number | undefined {
    if (value === undefined || value === null) {
      return undefined;
    }

    const parsed = parseInt(value, 10);
    if (isNaN(parsed) || parsed <= 0) {
      throw new BadRequestException({
        error_code: 'INVALID_DRIVER',
        error_description: 'driver_id must be a valid positive number',
      });
    }
    return parsed;
  }
}
