import mongoose, { Model } from 'mongoose';
import { IPagination } from 'src/shared/common.constants';
import { Errors } from 'src/shared/errors.constant';

import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreateTutorialDto } from './dto/create-tutorial.dto';
import { UpdateTutorialDto } from './dto/update-tutorial.dto';
import { Tutorial } from './schemas/tutotial.schema';
import { Category } from 'src/category/schemas/category.schema';

@Injectable()
export class TutorialsService {
  constructor(
    @InjectModel('tuts') private tutModel: Model<Tutorial>,
    @InjectModel('categories') private catModel: Model<Category>,
  ) {}

  async create(createTutorialDto: CreateTutorialDto, userId: string) {
    createTutorialDto['user'] = userId;
    const data = await this.tutModel.create(createTutorialDto);
    if (!data) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    await this.getAverageCost(createTutorialDto['category']);
    return { data: createTutorialDto };
  }

  async findAll(pagination: IPagination) {
    const { perpage, skip } = pagination;
    const [tuts, totalTuts] = await Promise.all([
      this.tutModel.find().skip(skip).limit(perpage),
      this.tutModel.countDocuments(),
    ]);
    return { data: tuts, totalTuts };
  }

  async findOne(id: string) {
    const idMongo = new mongoose.Types.ObjectId(id);
    const tut = await this.tutModel.findOne({ _id: idMongo });
    if (!tut) {
      throw new BadRequestException(Errors.INVALID_TUTORIAL_UUID);
    }
    return {
      data: tut,
    };
  }

  async update(
    id: string,
    updateTutorialDto: UpdateTutorialDto,
    userId: string,
  ) {
    // const idMongo = new mongoose.Types.ObjectId(id);
    const tut = await this.tutModel.findOne({ _id: id });
    if (!tut) {
      throw new BadRequestException(Errors.INVALID_TUTORIAL_UUID);
    }
    if (tut.user !== userId) {
      throw new BadRequestException(Errors.INVALID_TUTORIAL_OWNERSHIP);
    }
    let updatedData = await this.tutModel.updateOne(
      { _id: id },
      updateTutorialDto,
    );
    await this.getAverageCost(tut.category);
    return { updatedData };
  }

  async remove(id: string, userId: string) {
    const idMongo = new mongoose.Types.ObjectId(id);
    const tut = await this.tutModel.findOne({ _id: idMongo });
    if (!tut) {
      throw new BadRequestException(Errors.INVALID_CATEGORY_UUID);
    }
    if (tut.user !== userId) {
      throw new BadRequestException(Errors.INVALID_TUTORIAL_OWNERSHIP);
    }
    let deletedData = await this.tutModel.deleteOne({ _id: idMongo });

    await this.getAverageCost(tut.category);
    return { deletedData };
  }

  async getAverageCost(catId: string) {
    const obj = await this.tutModel.aggregate([
      {
        $match: { category: catId },
      },
      {
        $group: {
          _id: '$category',
          averageCost: { $avg: '$tuition' },
        },
      },
    ]);
    // console.log('obj', obj);
    try {
      await this.catModel.findByIdAndUpdate(catId, {
        averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
      });
      // console.log('updated cat id');
    } catch (error) {
      console.error(error);
    }
  }
}
