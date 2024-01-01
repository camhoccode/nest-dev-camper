import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import mongoose from 'mongoose';
export enum Careers {
  'Web Development' = 'Web Development',
  'Mobile Development' = 'Mobile Development',
  'UI/UX' = 'UI/UX',
  'Data Science' = 'Data Science',
  'Business' = 'Business',
  'Other' = 'Other',
}
export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  slug: string;

  @IsNotEmpty()
  @MaxLength(500, {
    message: 'Description can not be more than 500 characters',
  })
  description: string;

  @IsOptional()
  @Matches(
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
    { message: 'Please use a valid url with HTTP or HTTPS' },
  )
  website: string;

  @IsOptional()
  @Matches(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    { message: 'Please add a valid email' },
  )
  email: string;

  @IsOptional()
  @MaxLength(20, {
    message: 'Phone number can not be more than 20 characters',
  })
  phone: string;
  @IsNotEmpty({ message: 'Please add a address' })
  @MaxLength(200, {
    message: 'Address can not be more than 200 characters',
  })
  address: string;

  @IsNotEmpty()
  @IsEnum(Careers)
  career: string[];

  @Min(1, { message: 'Rating must be at least 1' })
  @Max(10, { message: 'Rating must be less than 10' })
  averageRating: string;

  averageCost: number;
  housing: boolean = false;
  jobAssistance: boolean = false;
  jobGuarantee: boolean = false;
  acceptGi: boolean = false;

  @IsNotEmpty()
  user: typeof mongoose.Schema.ObjectId;

  @IsDate()
  createdAt: Date = new Date();
}
