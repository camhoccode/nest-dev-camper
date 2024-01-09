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
    select: false,
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

  // Method to generate signed JWT token
  getSignedJwtToken(): string {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRED,
    });
  }

  // Method to generate hashed reset password token
  getResetPasswordToken(): string {
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    this.resetPasswordExpired = new Date(Date.now() + 10 * 60 * 1000);
    return resetToken;
  }

  // Method to match user password to hashed password in the database
  matchPassword(enteredPassword: string): Promise<boolean> {
    return bcrypt.compare(enteredPassword, this.password);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
