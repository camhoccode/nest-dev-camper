import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { IPagination } from 'src/shared/common.constants';
import { User } from './schemas/user.schema';
import { Errors } from 'src/shared/errors.constant';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel('users') private userModel: Model<User>) {}

  async findAll(pagination: IPagination) {
    const { perpage, skip } = pagination;
    const [users, totalUsers] = await Promise.all([
      await this.userModel.find().skip(skip).limit(perpage),
      await this.userModel.countDocuments(),
    ]);
    return {
      totalUsers,
      data: users,
    };
  }

  async findOne(id: string) {
    const idMongo = new mongoose.Types.ObjectId(id);
    const user = await this.userModel.findById(idMongo);
    if (!user) {
      throw new BadRequestException(Errors.INVALID_UUID);
    }
    return {
      data: user,
    };
  }
  async update(id: string, body: UpdateUserDto) {
    const idMongo = new mongoose.Types.ObjectId(id);
    const user = await this.userModel.findById(idMongo);
    if (!user) {
      throw new BadRequestException(Errors.INVALID_USERNAME);
    }
    const updatedData = await this.userModel.findByIdAndUpdate(idMongo, body);
    return {
      updatedData,
    };
  }
  async delete(id: string) {
    const idMongo = new mongoose.Types.ObjectId(id);
    const user = await this.userModel.findById(idMongo);
    if (!user) {
      throw new BadRequestException(Errors.INVALID_USERNAME);
    }
    await this.userModel.findByIdAndDelete(idMongo);
    return {};
  }

  async create(user: CreateUserDto) {
    const data = await this.userModel.create(user);
    if (!data) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return { data };
  }
}
