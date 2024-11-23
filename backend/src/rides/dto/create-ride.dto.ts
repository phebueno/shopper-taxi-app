import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRideDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  customer_id: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  origin: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  destination: string;
}
