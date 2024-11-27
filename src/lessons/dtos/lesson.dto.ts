import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
} from 'class-validator';

import { Type } from 'class-transformer';

export class CreateLessonDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsArray()
  @IsUrl({}, { each: true })
  @IsNotEmpty({ each: true })
  images: string;

  @IsOptional()
  @IsString()
  subject: string;

  @IsOptional()
  @IsString()
  grade: string;

  @IsOptional()
  publisher: string;
}

export class UpdateLessonDto extends CreateLessonDto {
  @IsNotEmpty()
  @IsOptional()
  readonly name: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  @IsNotEmpty({ each: true })
  images: string;
}

export class FilterLessonstDto {
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  limit: number;

  @IsOptional()
  @IsMongoId()
  cursor: number;

  @IsOptional()
  @IsString()
  q: string;

  @IsOptional()
  @IsString()
  subject: string;

  @IsOptional()
  @IsString()
  grade: string;

  @IsOptional()
  @IsString()
  sort: string;

  @IsOptional()
  @IsString()
  select: string;
}
