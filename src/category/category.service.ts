import mongoose, { Model } from 'mongoose';
import { Errors } from 'src/shared/errors.constant';

import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './schemas/category.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel('categories')
    private readonly categoryModel: Model<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const data = await this.categoryModel.create(createCategoryDto);
    if (!data) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return { data: createCategoryDto };
  }

  async findAll() {
    // const cats = await this.categoryModel.find();
    // return { data: cats };
  }

  async findOne(id: string) {
    const idMongo = new mongoose.Types.ObjectId(id);
    const cat = await this.categoryModel.findOne({ _id: idMongo });
    if (!cat) {
      throw new BadRequestException(Errors.INVALID_CATEGORY_UUID);
    }
    return {
      data: cat,
    };
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const idMongo = new mongoose.Types.ObjectId(id);
    const cat = await this.categoryModel.findOne({ _id: idMongo });
    if (!cat) {
      throw new BadRequestException(Errors.INVALID_CATEGORY_UUID);
    }
    let updatedData = await this.categoryModel.updateOne(
      { _id: idMongo },
      updateCategoryDto,
    );
    return { updatedData };
  }

  async remove(id: string) {
    const idMongo = new mongoose.Types.ObjectId(id);
    const cat = await this.categoryModel.findOne({ _id: idMongo });
    if (!cat) {
      throw new BadRequestException(Errors.INVALID_CATEGORY_UUID);
    }
    let deletedData = await this.categoryModel.deleteOne({ _id: idMongo });
    return { deletedData };
  }
}
