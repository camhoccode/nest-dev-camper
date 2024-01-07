import { Model } from 'mongoose';

import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Errors } from 'src/shared/errors.constant';
import { CatsModel } from './schemas/category.schema';

@Controller()
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    @InjectModel('Category') private categoryModel: Model<any>,
  ) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  findAll(@Res() response) {
    response.status(200).json(response.advanceResult);
    // return this.categoryService.findAll();
  }

  @Get(':id')
  async findOne(@Res() response, @Req() request) {
    return this.categoryService.findOne(request.params.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
