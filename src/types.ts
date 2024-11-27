import { Types } from 'mongoose';

export interface IUser {
  role: string;
  _id: Types.ObjectId;
  email: string;
  password: string;
}

import { Request } from 'express';
export interface IUserRequest extends Request {
  user: IUser;
}
