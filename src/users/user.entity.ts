import { Document } from 'mongoose';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { Lesson } from 'src/lessons/lesson.entity';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ type: 'String', required: true, unique: true })
  email: string;

  @Prop({ type: 'String', required: true })
  password: string;

  @Prop({ type: 'String', required: true })
  name: string;

  @Prop({ type: 'String', required: true, enum: ['user', 'admin'] })
  role: string;

  @Prop({ type: 'String', default: '' })
  phoneNumber: string;

  @Prop({ type: [Types.ObjectId], ref: "Lesson" })
  saved: Lesson[] | [Types.ObjectId];

  @Prop({ type: 'Boolean', default: false })
  verified: boolean;

  @Prop({ type: 'String' })
  verificationToken: string;

  @Prop({ type: Date })
  verificationTokenExpiresAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next: HookNextFunction) {
  const user = this as User;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // Random additional data
  const salt = await bcrypt.genSalt(10);

  const hash = await bcrypt.hash(user.password, salt);

  // Replace the password with the hash
  user.password = hash;

  return next();
});

// delete some properties before sending a response
UserSchema.methods.toJSON = function () {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {
    __v,
    password,
    verificationToken,
    verificationTokenExpiresAt,
    ...user
  } = this.toObject();

  return user;
};

interface HookNextFunction {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (error?: Error): any;
}
