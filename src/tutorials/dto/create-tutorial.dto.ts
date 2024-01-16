import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
} from 'class-validator';

export class CreateTutorialDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  weeks: string;

  @IsNumber()
  @IsNotEmpty()
  tuition: number;

  @IsArray()
  @IsEnum(['Beginner', 'Intermediate', 'Advanced'], { each: true })
  minimumSkills: string[];

  @IsBoolean()
  scholarshipAvailable: boolean;

  @IsMongoId()
  category: string;

  @IsMongoId()
  user: string;
}
