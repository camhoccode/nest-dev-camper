import mongoose, { Model } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { ForgotPasswordDto } from './dto/forgorPassword.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateDetailsDto } from './dto/updateDetails.dto';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { UserResponseDTO } from '../users/dtos/userResponse.dto';
import { Response } from 'express';
const crypto = require('crypto');

@Injectable()
export class AuthService {
  constructor(@InjectModel('users') private readonly userModel: Model<User>) {}

  async registerUser(body: RegisterDto): Promise<{ data: UserResponseDTO }> {
    const { name, email, password, role, phone } = body;
    const user = await this.userModel.create({
      name,
      email,
      password,
      role,
      phone,
    });
    if (!user) {
      throw new HttpException('Cant create user', 500);
    }
    return {
      data: user,
    };
  }
  async login(body: LoginDto): Promise<{ data: UserResponseDTO }> {
    const { email, password } = body;
    const user = await this.userModel.findOne({ email }).select('+password');
    if (!user) {
      throw new HttpException('Cant create user', 500);
    }
    return {
      data: user,
    };
  }
  async logout() {}
  async getMe(id: string): Promise<{ data: UserResponseDTO }> {
    const idMongo = new mongoose.Types.ObjectId(id);
    const user = await this.userModel.findById(idMongo);
    return { data: user };
  }

  async forgotPassword(
    body: ForgotPasswordDto,
  ): Promise<{ data: UserResponseDTO }> {
    const user = await this.userModel.findOne({ email: body.email });
    if (!user) {
      throw new HttpException('Cant create user', 500);
    }
    return {
      data: user,
    };
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
    const user = await this.userModel.findById(idMongo).select('+password');
    if (!(await user.matchPassword(currentPassword))) {
      throw new HttpException('Invalid user id.', 401);
    }
    user.password = newPassword;
    await user.save();
    return { data: user };
  }
  async resetPassword(resettoken: string): Promise<{ user: UserResponseDTO }> {
    // get hash token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resettoken)
      .digest('hex');
    const user = await this.userModel.findOne({
      resetPasswordToken,
      resetPasswordExpired: { $gt: Date.now() },
    });
    if (!user) {
      throw new HttpException('Invalid resetPasswordToken.', 401);
    }
    return { user };
  }

  async setTokenResponse(
    user: UserResponseDTO | null,
    statusCode: number,
    res: Response,
  ) {
    const token = user.getSignedJwtToken();
    const options = {
      expires: new Date(
        new Date().getTime() +
          parseInt(process.env.JWT_COOKIE_EXPIRED) * 24 * 3600 * 1000,
      ),
      httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') {
      options['secure'] = true;
    }

    res.status(statusCode).cookie('token', token, options).json({
      success: true,
      token,
    });
  }
}
