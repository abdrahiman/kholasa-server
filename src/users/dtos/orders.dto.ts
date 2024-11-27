import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsOptional,
  IsString,
  Min,
  IsPositive,
} from 'class-validator';

export class CreateOrderDto {
  @IsArray()
  @IsNotEmpty()
  readonly products: string[];

  @IsOptional()
  @IsString()
  readonly message: {};
}

export class UpdateOrderDto {
  @IsOptional()
  @IsArray()
  readonly products: string[];

  @IsOptional()
  @ValidateNested()
  readonly location: {};
}

export class AddProductstoOderDto {
  @IsArray()
  @IsNotEmpty()
  readonly productsIds: string[];
}

export class FilterOrderstDto {
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  limit: number;

  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset: number;

  @IsOptional()
  @IsString()
  q: string;

  @IsOptional()
  @IsString()
  sort: string;

  @IsOptional()
  @IsString()
  select: string;
}
