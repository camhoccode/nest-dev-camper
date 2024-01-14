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

  createdAt?: Date;

  constructor(user: UserResponseDTO) {
    Object.assign(this, user);
  }
}
