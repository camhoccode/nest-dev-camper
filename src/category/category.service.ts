import { Model } from 'mongoose';
import { Errors } from 'src/shared/errors.constant';

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CatsModel } from './schemas/category.schema';

@Injectable()
export class CategoryService {
  constructor(@InjectModel('Category') private categoryModel: Model<any>) {}

  create(createCategoryDto: CreateCategoryDto) {
    return 'This action adds a new category';
  }

  async findAll() {
    // const cats = await this.categoryModel.find();
    // return { data: cats };
  }

  async findOne(id: string) {
    const cat = await this.categoryModel.findOne({ _id: id });
    if (!cat) {
      throw new BadRequestException(Errors.INVALID_CATEGORY_UUID);
    }
    return {
      data: cat,
    };
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  async remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
