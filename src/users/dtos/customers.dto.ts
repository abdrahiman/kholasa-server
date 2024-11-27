import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly lastName: string;

  @IsOptional()
  @IsPhoneNumber('MA')
  @IsNotEmpty()
  readonly phone: string;

  @IsOptional()
  readonly avatar: string;

  @IsOptional()
  city: string;

  @IsMongoId()
  user: string;
}

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsOptional()
  @IsString()
  @IsOptional()
  readonly lastName: string;

  @IsOptional()
  @IsPhoneNumber('MA')
  @IsNotEmpty()
  readonly phone: string;

  @IsOptional()
  readonly avatar: string;

  @IsOptional()
  city: string;
}
