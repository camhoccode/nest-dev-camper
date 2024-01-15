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
  UseGuards,
} from '@nestjs/common';

import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationParamDecorator } from 'src/decorators/pagination.decorator';
import { EUserRole, IPagination } from 'src/shared/common.constants';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/decorators/role.decorator';

@UseGuards(AuthGuard)
@Controller()
export class CategoryController {
  constructor(
    @Inject('CategoryService')
    private readonly categoryService: CategoryService, // @InjectModel('Category') private categoryModel: Model<any>,
  ) {}

  @Roles([EUserRole.admin, EUserRole.teacher])
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
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
  update(@Param('id') id, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Roles([EUserRole.admin, EUserRole.teacher])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
