import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Lesson, LessonSchema } from './lesson.entity';
import { LessonController } from './lessons.controller';
import { LessonService } from './lessons.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Lesson.name,
        schema: LessonSchema,
      },
    ]),
  ],
  controllers: [LessonController],
  providers: [LessonService],
  exports: [LessonService],
})
export class LessonsModule {}
