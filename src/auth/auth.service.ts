import { Model } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { ForgotPasswordDto } from './dto/forgorPassword.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateDetailsDto } from './dto/updateDetails.dto';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { UserResponseDTO } from '../users/dtos/userResponse.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel('users') private readonly userModel: Model<User>) {}

  async registerUser(body: RegisterDto) {
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
  async login(body: LoginDto) {}
  async logout() {}
  async getMe() {}
  async forgotPassword(body: ForgotPasswordDto) {}
  async updateDetails(body: UpdateDetailsDto) {}
  async updatePassword(body: UpdatePasswordDto) {}
  async resetPassword(token: string) {}

  async setTokenResponse(user: UserResponseDTO, statusCode, res) {
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
