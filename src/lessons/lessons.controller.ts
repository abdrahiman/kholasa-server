import {
  Controller,
  Get,
  Param,
  HttpStatus,
  HttpCode,
  Post,
  Body,
  Put,
  Delete,
  Query,
  Request,
  UploadedFile,
  UseInterceptors,
  HttpException,
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { FileInterceptor, MulterModule } from '@nestjs/platform-express';

import {
  CreateLessonDto,
  UpdateLessonDto,
  FilterLessonstDto,
} from './dtos/lesson.dto';
import { IsMongoIdPipe } from 'src/common';
import { LessonService } from './lessons.service';
import { Role, Roles } from 'src/auth/decorator/roles.decorator';
import { Public } from 'src/auth/decorator/public.decorator';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { IUser } from 'src/types';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('lessons')
export class LessonController {
  constructor(private lessonsService: LessonService) {}

  @Get()
  @Public()
  async findMany(@Query() params: FilterLessonstDto) {
    return await this.lessonsService.findMany(params);
  }

  @Get(':id')
  @Public()
  @HttpCode(HttpStatus.ACCEPTED)
  async findById(@Param('id', IsMongoIdPipe) id: string) {
    return await this.lessonsService.findById(id);
  }

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() payload: CreateLessonDto, @Request() req) {
    let user: IUser = req.user;
    return this.lessonsService.create(payload, user._id.toString());
  }

  @Roles(Role.ADMIN)
  @Put(':id')
  update(
    @Param('id', IsMongoIdPipe) id: string,
    @Body() payload: UpdateLessonDto,
  ) {
    return this.lessonsService.update(id, payload);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id', IsMongoIdPipe) id: string) {
    return this.lessonsService.remove(id);
  }

  @Post('upload')
  // @Roles(Role.ADMIN)
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, callback) => {
        if (file.mimetype !== 'application/pdf') {
          return callback(
            new HttpException(
              'Invalid file type. Only PDF files are allowed.',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async uploadPdf(@UploadedFile() file, @Query('scale') scale) {
    console.log('hello');
    if (!file) {
      throw new HttpException('File not provided.', HttpStatus.BAD_REQUEST);
    }
    const pdfBuffer = file.buffer;
    if (scale && !isNaN(+scale)) scale = parseInt(scale);
    else scale = 1.5;
    if (scale < 1 || scale > 5) {
      throw new HttpException(
        'Scale value out of optimal range. Please use a value between 1 and 5.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const images = await this.lessonsService.convertPdfToImages(
      pdfBuffer,
      scale,
    );
    if (images.length > 20) {
      throw new HttpException(
        'Too many images generated from PDF.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const imagesUrl: string[] = await Promise.all(
      images.map((image: any) => this.lessonsService.uploadImage(image)),
    );
    return { pages: imagesUrl.length, images: imagesUrl };
  }
}
