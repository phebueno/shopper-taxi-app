import { Transform, TransformFnParams } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class UpdateDriverDto {
  @IsInt()
  @Min(1)
  id: number;

  @IsString({ message: 'Driver name must be a string' })
  @IsNotEmpty({ message: 'Driver name should not be empty' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  name: string;
}
