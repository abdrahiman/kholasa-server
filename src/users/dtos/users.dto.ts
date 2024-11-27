import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Min,
  ValidateIf,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @Length(6)
  @IsNotEmpty()
  password: string;

  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(['customer', 'admin'])
  role: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsString()
  @Length(6)
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsEnum(['customer', 'admin'])
  role: string;
}

export class FilterUserstDto {
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
