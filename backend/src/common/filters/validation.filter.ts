import { BadRequestException } from '@nestjs/common';

export const validationExceptionFactory = (
  errors: any[],
): BadRequestException => {
  const errorDescription = errors
    .map((e) => {
      const constraints = e.constraints
        ? Object.values(e.constraints).join(', ')
        : 'Some constraints are missing';
      return `${e.property}: ${constraints}`;
    })
    .join(' | ');

  return new BadRequestException({
    error_code: 'INVALID_DATA',
    error_description: errorDescription,
  });
};

export const validationPipeOptions = {
  exceptionFactory: validationExceptionFactory,
};
