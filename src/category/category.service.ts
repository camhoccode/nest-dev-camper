import mongoose, { Model } from 'mongoose';
import { Errors } from 'src/shared/errors.constant';
const path = require('path');

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
import { IPagination } from 'src/shared/common.constants';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel('categories')
    private readonly categoryModel: Model<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, userId: string) {
    createCategoryDto.user = userId;
    const data = await this.categoryModel.create(createCategoryDto);
    if (!data) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return { data: createCategoryDto };
  }

  async findAll(pagination: IPagination) {
    const { perpage, skip } = pagination;
    const [cats, totalCats] = await Promise.all([
      this.categoryModel
        .find()
        .skip(skip)
        .limit(perpage)
        .populate('tuts')
        .exec(),
      this.categoryModel.countDocuments(),
    ]);
    return { totalCats, data: cats };
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

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    userId: string,
  ) {
    const idMongo = new mongoose.Types.ObjectId(id);
    const cat = await this.categoryModel.findOne({ _id: idMongo });
    if (!cat) {
      throw new BadRequestException(Errors.INVALID_CATEGORY_UUID);
    }
    if (cat.user !== userId) {
      throw new BadRequestException(Errors.INVALID_CATEGORY_OWNERSHIP);
    }

    let updatedData = await this.categoryModel.updateOne(
      { _id: idMongo },
      updateCategoryDto,
    );
    return { updatedData };
  }

  async uploadImage(id: string, files: any, userId: string) {
    const idMongo = new mongoose.Types.ObjectId(id);
    const cat = await this.categoryModel.findOne({ _id: idMongo });
    if (!cat) {
      throw new BadRequestException(Errors.INVALID_CATEGORY_UUID);
    }
    if (cat.user !== userId) {
      throw new BadRequestException(Errors.INVALID_CATEGORY_OWNERSHIP);
    }
    if (!files) {
      throw new BadRequestException(Errors.NO_FILE_INPUT);
    }
    // console.log('file image', file);
    const { file } = files;
    // make sure the image is a photo
    if (!file.mimetype.startsWith('image')) {
      throw new HttpException('File must be a image file', 500);
    }
    // make sure the file size is not too big
    if (file.size > process.env.MAX_FILE_UPLOAD) {
      throw new HttpException(
        `File size should be less than ${Math.floor(
          parseInt(process.env.MAX_FILE_UPLOAD) / 1000,
        )} Mb`,
        500,
      );
    }
    file.name = `photo_${id}${path.parse(file.name).ext}`;
    await file.mv(
      `${process.env.FILE_UPLOAD_PATH}/${file.name}`,
      async (err) => {
        if (err) {
          throw new HttpException('There was a problem saving the file', 500);
        }
      },
    );
    await this.categoryModel.updateOne(
      { _id: idMongo },
      {
        photo: file.name,
      },
    );
    return {
      data: { fileName: file.name },
      msg: `Update photo for a category id of ${id}`,
    };
  }

  async remove(id: string, userId) {
    const idMongo = new mongoose.Types.ObjectId(id);
    const cat = await this.categoryModel.findOne({ _id: idMongo });
    if (!cat) {
      throw new BadRequestException(Errors.INVALID_CATEGORY_UUID);
    }
    if (cat.user !== userId) {
      throw new BadRequestException(Errors.INVALID_CATEGORY_OWNERSHIP);
    }
    let deletedData = await this.categoryModel.deleteOne({ _id: idMongo });
    return { deletedData };
  }
}
