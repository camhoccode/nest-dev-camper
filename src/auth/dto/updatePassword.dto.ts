import { IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString({ message: 'Please add a password for the user' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  currentPassword: string;
  @IsString({ message: 'Please add a password for the user' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  updatedPassword: string;
}
