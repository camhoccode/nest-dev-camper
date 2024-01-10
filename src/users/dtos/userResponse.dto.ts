import {
  IsDate,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

enum UserRole {
  USER = 'user',
  PUBLISHER = 'publisher',
}

export class UserResponseDTO {
  @IsString()
  name: string;
  @IsString()
  _id: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEmail({})
  email: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: string;

  @IsString()
  @MaxLength(20)
  @IsOptional()
  phone?: string;

  @IsString()
  resetPasswordToken: string;
  @IsDate()
  resetPasswordExpired: Date;

  // Method to generate hashed reset password token
  getResetPasswordToken(): string {
    const resetToken = crypto.randomBytes(20).toString('hex');
    // hash tolen and set to resetpasswordtoken field
    this.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // set expire
    this.resetPasswordExpired = new Date(new Date().getTime() + 10 * 60 * 1000);
    return resetToken;
  }

  // Method to match user password to hashed password in the database
  matchPassword(enteredPassword: string): boolean {
    return bcrypt.compare(enteredPassword, this.password);
  }

  // Method to generate signed JWT token
  getSignedJwtToken(): string {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRED,
    });
  }

  createdAt?: Date;

  constructor(user: UserResponseDTO) {
    Object.assign(this, user);
  }
}
