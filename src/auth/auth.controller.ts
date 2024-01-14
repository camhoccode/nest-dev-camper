import { Request, Response } from 'express';
import { sendEmail } from 'src/ultis/sendEmail';

import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgorPassword.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateDetailsDto } from './dto/updateDetails.dto';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { Cookies } from 'src/decorators/cookies.decorator';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectModel('users') private userModel: Model<User>,
  ) {}

  @Post('/register')
  async register(
    @Body() body: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.register(body);
    const token = jwt.sign({ id: user.data._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRED,
    });
    const options = {
      expires: new Date(
        Date.now() +
          parseInt(process.env.JWT_COOKIE_EXPIRED) * 24 * 3600 * 1000,
      ),
      httpOnly: true,
    };
    res.cookie('token', token, options);

    return user;
  }

  @Post('/login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.login(body);
    const token = jwt.sign({ id: user.data._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRED,
    });
    const options = {
      expires: new Date(
        Date.now() +
          parseInt(process.env.JWT_COOKIE_EXPIRED) * 24 * 3600 * 1000,
      ),
      httpOnly: true,
    };
    res.cookie('token', token, options);
    return user;
  }

  @Post('/forgotpassword')
  async forgotPassword(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() body: ForgotPasswordDto,
  ) {
    const user = await this.authService.forgotPassword(body);
    if (!user) {
      throw new HttpException('Cant find user', 500);
    }
    // get reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    // hash tolen and set to resetpasswordtoken field
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // set expire
    const resetPasswordExpired = new Date(Date.now() + 10 * 60 * 1000);

    await this.userModel.findOneAndUpdate(
      { email: body.email },
      {
        resetPasswordExpired,
        resetPasswordToken,
      },
    );

    // create reset url
    const resetUrl = `${req.protocol}://${req.get(
      'host',
    )}/api/v1/auth/updatepassword/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl} `;

    try {
      await sendEmail({
        email: user.data.email,
        subject: 'Password reset',
        message,
      });
      res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
      console.error(err);
      throw new HttpException('Email could not be sent', 500);
    }
  }

  @Put('/updatepassword/:resettoken')
  async resetPassword(@Param('resettoken') resetToken: string, @Body() body) {
    return await this.authService.resetPassword(resetToken, body);
  }

  @Put('/updatedetails')
  async updateDetails(
    @Body() body: UpdateDetailsDto,
    @Cookies('token') token: string,
  ) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return this.authService.updateDetails(decoded.id, body);
  }

  @Put('/updatepassword')
  async updatePassword(
    @Body() body: UpdatePasswordDto,
    @Cookies('token') token: string,
  ) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return this.authService.updatePassword(decoded.id, body);
  }

  @Post('/logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('token', 'none');
    return this.authService.logout();
  }

  @Get('/me')
  async getMe(@Cookies('token') token: any) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await this.authService.getMe(decoded.id);
    return user;
  }
}
