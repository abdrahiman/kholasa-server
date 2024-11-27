import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import {
  CreateUserDto,
  FilterUserstDto,
  UpdateUserDto,
} from './dtos/users.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findMany(params: FilterUserstDto) {
    const { limit = 10, offset = 0, q, sort = '-createdAt', select } = params;
    const filters: FilterQuery<User> = {};

    if (q) {
      filters.$or = [{ email: { $regex: q } }];
    }

    let data = this.userModel
      .find(filters)
      .skip(offset * limit)
      .sort(sort)
      .limit(limit);

    if (select) {
      data.select(select);
    }
    let users = await data;

    return users;
  }

  async findById(id: string) {
    const user = await this.userModel.findById(id).exec();

    if (!user) throw new NotFoundException(`User with id ${id} not found: run`);

    return user;
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email }).exec();
  }

  async create(payload: CreateUserDto) {
    const { email } = payload;

    const olduser = await this.userModel.findOne({ email });
    if (olduser) throw new BadRequestException(`Email ${email} already exists`);

    const newUser = new this.userModel(payload);

    return await newUser.save();
  }

  async update(id: string, payload: UpdateUserDto) {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { $set: payload },
      { new: true },
    );

    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    return user;
  }

  async remove(id: string) {
    let user = await this.userModel.findByIdAndDelete(id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }
}
