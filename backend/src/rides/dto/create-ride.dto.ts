import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRideDto {
  @IsString({ message: 'Customer ID must be a string' })
  @IsNotEmpty({ message: 'Customer ID should not be empty' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  customer_id: string;

  @IsString({ message: 'Origin must be a string' })
  @IsNotEmpty({ message: 'Origin should not be empty' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  origin: string;

  @IsString({ message: 'Destination must be a string' })
  @IsNotEmpty({ message: 'Destination should not be empty' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  destination: string;
}
