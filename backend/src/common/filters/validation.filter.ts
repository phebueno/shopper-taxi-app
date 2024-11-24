import { BadRequestException } from '@nestjs/common';

export const validationExceptionFactory = (errors: any[]): BadRequestException => {
  return new BadRequestException({
    error_code: 'INVALID_DATA',
    error_description: errors
      .map(e => `${e.property}: ${Object.values(e.constraints).join(', ')}`)
      .join(' | '),
  });
};

export const validationPipeOptions = {
  exceptionFactory: validationExceptionFactory,
};