import { Document } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: [true, 'Please add name for user'] })
  name: string;

  @Prop({
    type: String,
    minlength: 6,
    // select: false,
    required: [true, 'Please add password for user'],
  })
  password: string;

  @Prop({
    type: String,
    required: [true, 'Please add a valid email'],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please add a valid email'],
  })
  email: string;

  @Prop({
    type: String,
    enum: ['user', 'teacher'],
    default: 'user',
  })
  role: string;

  @Prop({
    type: String,
    maxlength: [20, 'Phone number can not be more than 20 characters'],
  })
  phone: string;

  @Prop()
  resetPasswordToken: string;

  @Prop()
  resetPasswordExpired: Date;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
