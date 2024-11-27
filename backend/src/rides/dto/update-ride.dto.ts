import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { CreateRideDto } from '@/rides/dto/create-ride.dto';
import { UpdateDriverDto } from '@/drivers/dto/update-driver.dto';

export class UpdateRideDto extends CreateRideDto {
  @IsInt()
  @Min(1)
  distance: number;

  @IsString({ message: 'Duration must be a string' })
  @IsNotEmpty({ message: 'Duration should not be empty' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  duration: string;

  @ValidateNested()
  @Type(() => UpdateDriverDto)
  @IsNotEmpty({ message: 'Driver should not be empty' })
  driver: UpdateDriverDto;

  @IsNumber()
  @Min(0.01)
  value: number;
}
