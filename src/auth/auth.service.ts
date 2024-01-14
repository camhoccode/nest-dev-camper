import mongoose, { Model } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
const bcrypt = require('bcrypt');

import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { ForgotPasswordDto } from './dto/forgorPassword.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateDetailsDto } from './dto/updateDetails.dto';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { UserResponseDTO } from '../users/dtos/userResponse.dto';
import { Response } from 'express';
const crypto = require('crypto');
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
  constructor(@InjectModel('users') private readonly userModel: Model<User>) {}

  async register(body: RegisterDto): Promise<{ data: UserResponseDTO }> {
    const { name, email, password, role, phone } = body;
    const checkingUser = await this.userModel.findOne({ email });
    if (checkingUser) {
      throw new BadRequestException('Email already exist');
    }
    // hashing password
    const salt = await bcrypt.genSalt(10);
    const result = await bcrypt.hash(password, salt);
    // create user
    const user = await this.userModel.create({
      name,
      email,
      password: result,
      role,
      phone,
    });
    if (!user) {
      throw new HttpException('Cant create user', 500);
    }

    // hide password
    user.password = undefined;
    return {
      data: user,
    };
  }
  async login(body: LoginDto): Promise<{ data: UserResponseDTO }> {
    const { email, password } = body;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('Cant found user');
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Wrong password');
    }
    // hide password
    user.password = undefined;
    return {
      data: user,
    };
  }
  async logout() {
    return { msg: 'Logged out' };
  }

  async getMe(id: string): Promise<{ data: UserResponseDTO }> {
    const idMongo = new mongoose.Types.ObjectId(id);
    const user = await this.userModel.findById(idMongo);
    if (!user) {
      throw new NotFoundException('Cant found user');
    }
    // hide password
    user.password = undefined;
    return { data: user };
  }

  async forgotPassword(
    body: ForgotPasswordDto,
  ): Promise<{ data: UserResponseDTO }> {
    const user = await this.userModel.findOne({ email: body.email });
    if (!user) {
      throw new HttpException('Cant find user', 500);
    }
    return {
      data: user,
    };
  }

  async resetPassword(
    resettoken: string,
    body,
  ): Promise<{ user: UserResponseDTO }> {
    // get hash token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resettoken)
      .digest('hex');

    const user = await this.userModel.findOne({
      resetPasswordToken,
      resetPasswordExpired: { $gt: new Date() },
    });
    if (!user) {
      throw new HttpException('Invalid resetPasswordToken.', 401);
    }

    // hashing password
    const salt = await bcrypt.genSalt(10);
    const result = await bcrypt.hash(body.password, salt);

    await this.userModel.findOneAndUpdate(
      { resetPasswordToken },
      { password: result },
    );

    user.password = undefined;
    return { user };
  }
  async updateDetails(
    id: string,
    body: UpdateDetailsDto,
  ): Promise<{ data: UserResponseDTO }> {
    const idMongo = new mongoose.Types.ObjectId(id);

    const fieldToUpdate = {
      name: body.name,
      emal: body.email,
    };
    const user = await this.userModel.findByIdAndUpdate(
      idMongo,
      fieldToUpdate,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!user) {
      throw new HttpException('Cant update user', 500);
    }
    return {
      data: user,
    };
  }
  async updatePassword(
    id: string,
    body: UpdatePasswordDto,
  ): Promise<{ data: UserResponseDTO }> {
    const { currentPassword, newPassword } = body;
    const idMongo = new mongoose.Types.ObjectId(id);
    const user = await this.userModel.findById(idMongo);

    if (!(await bcrypt.compare(currentPassword, user.password))) {
      throw new HttpException('Invalid user password.', 401);
    }
    // hashing password
    const salt = await bcrypt.genSalt(10);
    const newSavedPassword = await bcrypt.hash(newPassword, salt);
    const newUser = await this.userModel.findByIdAndUpdate(idMongo, {
      password: newSavedPassword,
    });
    // hide password
    newUser.password = undefined;

    return { data: newUser };
  }
}
