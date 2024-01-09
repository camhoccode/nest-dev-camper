import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
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
import { PaginationParamDecorator } from 'src/decorators/pagination.decorator';
import { IPagination } from 'src/shared/common.constants';

@Controller()
export class CategoryController {
  constructor(
    @Inject('CategoryService')
    private readonly categoryService: CategoryService, // @InjectModel('Category') private categoryModel: Model<any>,
  ) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  findAll(
    // @Res() response,
    @PaginationParamDecorator() pagination: IPagination,
  ) {
    // response.status(200).json(response.advanceResult);
    return this.categoryService.findAll(pagination);
  }

  @Get(':id')
  async findOne(@Param() id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
