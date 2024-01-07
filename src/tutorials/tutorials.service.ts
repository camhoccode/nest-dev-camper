import { Injectable } from '@nestjs/common';
import { CreateTutorialDto } from './dto/create-tutorial.dto';
import { UpdateTutorialDto } from './dto/update-tutorial.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPagination } from 'src/shared/common.constants';

@Injectable()
export class TutorialsService {
  constructor(@InjectModel('tuts') private tutModel: Model<any>) {}
  create(createTutorialDto: CreateTutorialDto) {
    return 'This action adds a new tutorial';
  }

  async findAll(pagination: IPagination) {
    const { page, skip } = pagination;
    const [tuts, totalTuts] = await Promise.all([
      this.tutModel.find().skip(skip).limit(page),
      this.tutModel.countDocuments(),
    ]);
    return { data: tuts, totalTuts };
  }

  findOne(id: number) {
    return `This action returns a #${id} tutorial`;
  }

  update(id: number, updateTutorialDto: UpdateTutorialDto) {
    return `This action updates a #${id} tutorial`;
  }

  remove(id: number) {
    return `This action removes a #${id} tutorial`;
  }
}
