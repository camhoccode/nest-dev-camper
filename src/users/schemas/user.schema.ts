import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
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
    enum: ['user', 'publisher'],
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

  // Mongoose middleware for password encryption
  async preSave(next: Function): Promise<void> {
    if (!this.isModified('password')) {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  }

  // sign jwt and return
  getSignedJwtToken() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRED,
    });
  }

  // generate hashed password
  getResetPasswordToken() {
    const resetToken = crypto.randomBytes(20).toString('hex');
    // hash tolen and set to resetpasswordtoken field
    this.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // set expire
    this.resetPasswordExpired = new Date(Date.now() + 10 * 60 * 1000);
    return resetToken;
  }

  // match user password to hashed password in database
  matchPassword(enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
