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
  Session,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgorPassword.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateDetailsDto } from './dto/updateDetails.dto';
import { UpdatePasswordDto } from './dto/updatePassword.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() body: RegisterDto, @Session() session: any) {
    const user = await this.authService.register(body);
    session.userId = user.data._id;
    return user;
    // await this.authService.setTokenResponse(user.data, 200, res);
  }

  @Post('/login')
  async login(@Body() body: LoginDto, @Session() session: any) {
    const user = await this.authService.login(body);
    session.userId = user.data._id;
    return user;
    // const user = await this.authService.login(body);
    // await this.authService.setTokenResponse(user.data, 200, res);
  }

  @Post('/forgotpassword')
  async forgotPassword(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: ForgotPasswordDto,
  ) {
    const { data } = await this.authService.forgotPassword(body);
    // get reset token
    const resetToken = data.getResetPasswordToken();
    // await data.save({ validateBeforeSave: false });
    //   console.log(resetToken);
    // create reset url
    const resetUrl = `${req.protocol}://${req.get(
      'host',
    )}/api/v1/auth/resetpassword/${resetToken}`;
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl} `;

    try {
      await sendEmail({
        email: data.email,
        subject: 'Password reset',
        message,
      });
      res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
      console.error(err);
      data.resetPasswordToken = undefined;
      //   await data.save({ validateBeforeSave: false });
      throw new HttpException('Email could not be sent', 500);
    }
  }

  @Put('/updatepassword/:resettoken')
  async resetPassword(@Param('resettoken') resetToken: string, @Body() body) {
    const { user } = await this.authService.resetPassword(resetToken);

    // set new password
    user.password = body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpired = undefined;

    // await user.save();
  }

  @Put('/updatedetails')
  async updateDetails(
    @Req() req: any,
    @Body() body: UpdateDetailsDto,
    @Res() res: Response,
  ) {
    const user = await this.authService.updateDetails(req.user.id, body);
    await this.authService.setTokenResponse(user.data, 200, res);
  }

  @Put('/updatepassword')
  async updatePassword(
    @Body() body: UpdatePasswordDto,
    @Req() req,
    @Res() res,
  ) {
    const user = await this.authService.updatePassword(req.user.id, body);
    await this.authService.setTokenResponse(user.data, 200, res);
  }

  @Post('/logout')
  async logout(@Session() session: any) {
    session.userId = null;
    return {};
  }

  @Get('/me')
  async getMe(@Session() session: any) {
    const user = await this.authService.getMe(session.userId);
    return user;
    // await this.authService.setTokenResponse(user.data, 200, res);
  }
}
