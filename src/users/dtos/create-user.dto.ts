import {
  IsString,
  MinLength,
  IsEmail,
  IsOptional,
  IsEnum,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Please add a name for the user' })
  name: string;

  @IsString({ message: 'Please add a password for the user' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsEmail({}, { message: 'Please add a valid email' })
  email: string;

  @IsEnum(['user', 'teacher'], { message: 'Invalid user role' })
  role: string;

  @IsOptional()
  @IsString({ message: 'Phone number must be a string' })
  phone: string;

  // Other fields such as resetPasswordToken, resetPasswordExpired, createdAt, etc.
  // should be added here if you want to include them in the DTO.

  // You may also want to add validation for other fields like resetPasswordToken,
  // resetPasswordExpired, createdAt, etc., based on your application requirements.

  // Note: This DTO includes only basic validations. You can customize it according
  // to your specific needs.

  constructor(partial: Partial<CreateUserDto>) {
    Object.assign(this, partial);
  }
}
