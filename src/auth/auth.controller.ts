import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { UpdateDetailsDto } from './dto/updateDetails.dto';
import { ForgotPasswordDto } from './dto/forgorPassword.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  registerUser(@Body() body: RegisterDto) {
    this.authService.registerUser(body);
  }
  @Post('/login')
  login(@Body() body: LoginDto) {
    this.authService.login(body);
  }
  @Post('/forgotpassword')
  forgotPassword(@Body() body: ForgotPasswordDto) {
    this.authService.forgotPassword(body);
  }
  @Put('/updatedetails')
  updateDetails(@Body() body: UpdateDetailsDto) {
    this.authService.updateDetails(body);
  }
  @Put('/updatepassword')
  updatePassword(@Body() body: UpdatePasswordDto) {
    this.authService.updatePassword(body);
  }
  @Put('/updatepassword/:resettoken')
  resetPassword(@Param('resettoken') resetToken: string) {
    this.authService.resetPassword(resetToken);
  }
  @Get('/logout')
  logout() {
    this.authService.logout();
  }
}
