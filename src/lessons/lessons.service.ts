import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
// import { convert } from 'pdf-img-convert';
import * as fs from 'fs';

import {
  CreateLessonDto,
  UpdateLessonDto,
  FilterLessonstDto,
} from './dtos/lesson.dto';
import { Lesson } from './lesson.entity';
import { IMAGE_PRESET } from 'src/constants';

@Injectable()
export class LessonService {
  constructor(
    @InjectModel(Lesson.name) private readonly lessonModel: Model<Lesson>,
  ) {}

  async findMany(params?: FilterLessonstDto) {
    const {
      limit = 10,
      cursor,
      q,
      sort = '-createdAt',
      select,
      grade,
      subject,
    } = params;
    const filters: FilterQuery<Lesson> = {};

    if (q) {
      filters.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ];
    }
    if (grade) {
      filters.grade = grade;
    }
    if (subject) {
      filters.subject = subject;
    }

    let data = this.lessonModel.find(filters).limit(limit);

    if (cursor) {
      data = data.where('_id').gt(cursor);
    }

    if (select) {
      data.select(select);
    }

    const lessons = await data.sort(sort);
    const total = lessons.length;

    return { total, lessons };
  }

  async findById(id: string) {
    const lesson = await this.lessonModel.findById(id).exec();

    if (!lesson)
      throw new NotFoundException(`404: Lesson with id:${id} not found`);

    return lesson;
  }

  async create(payload: CreateLessonDto, userID: string) {
    payload.publisher = userID;

    const newlesson = new this.lessonModel(payload);

    return await newlesson.save();
  }

  async update(id: string, payload: UpdateLessonDto) {
    const lesson = await this.lessonModel
      .findByIdAndUpdate(id, { $set: payload }, { new: true })
      .exec();

    if (!lesson) throw new NotFoundException(`lesson with id ${id} not found`);

    return lesson;
  }

  async remove(id: string) {
    const lesson = await this.lessonModel.findByIdAndDelete(id);

    if (!lesson)
      throw new NotFoundException(`404: lesson with id ${id} not found`);

    return lesson;
  }
  async convertPdfToImages(
    pdfBuffer: Buffer,
    scale: number,
  ): Promise<string[] | Uint8Array[]> {
    try {
      // let pdfArray = await convert(pdfBuffer, { scale });
      let pdfArray = [];
      return pdfArray;
    } catch (error) {
      throw Error('Failed to process this pdf');
    }
  }
  async uploadImage(file: Uint8Array): Promise<string> {
    //for testing
    // fs.writeFile('output.png', file, (err) => {
    //   if (err) console.log(err);
    //   console.log('done');
    // });
    // return;
    const data = new FormData();
    const blob = new Blob([file], { type: 'image/png' });
    data.append('file', blob);
    data.append('upload_preset', IMAGE_PRESET);
    const res = await fetch(
      'https://api.cloudinary.com/v1_1/dgvxswr30/image/upload',
      {
        method: 'POST',
        body: data,
      },
    );
    const fileUploaded = await res.json();
    return fileUploaded.secure_url;
  }
}
