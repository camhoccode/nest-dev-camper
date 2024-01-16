import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from 'src/auth/auth.service';
import { Cookies } from 'src/decorators/cookies.decorator';
import { PaginationParamDecorator } from 'src/decorators/pagination.decorator';
import { Roles } from 'src/decorators/role.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { EUserRole, IPagination } from 'src/shared/common.constants';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
const jwt = require('jsonwebtoken');

@UseGuards(AuthGuard)
@Controller()
export class CategoryController {
  constructor(
    @Inject('CategoryService')
    private readonly categoryService: CategoryService, // @InjectModel('Category') private categoryModel: Model<any>,
  ) {}

  @Roles([EUserRole.admin, EUserRole.teacher])
  @Post()
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Cookies('token') token: string,
  ) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return this.categoryService.create(createCategoryDto, decoded.id);
  }

  @Get()
  findAll(@PaginationParamDecorator() pagination: IPagination) {
    // response.status(200).json(response.advanceResult);
    return this.categoryService.findAll(pagination);
  }

  @Get(':id')
  async findOne(@Param() id: string) {
    return this.categoryService.findOne(id);
  }

  @Roles([EUserRole.admin, EUserRole.teacher])
  @Patch(':id')
  update(
    @Param('id') id,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Cookies('token') token: string,
  ) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return this.categoryService.update(id, updateCategoryDto, decoded.id);
  }

  @Roles([EUserRole.admin, EUserRole.teacher])
  @Delete(':id')
  remove(@Param('id') id: string, @Cookies('token') token: string) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return this.categoryService.remove(id, decoded.id);
  }
}
