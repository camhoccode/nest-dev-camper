import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TutorialsService } from './tutorials.service';
import { CreateTutorialDto } from './dto/create-tutorial.dto';
import { UpdateTutorialDto } from './dto/update-tutorial.dto';
import { PaginationParamDecorator } from 'src/decorators/pagination.decorator';
import { EUserRole, IPagination } from 'src/shared/common.constants';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/decorators/role.decorator';
import { Cookies } from 'src/decorators/cookies.decorator';

const jwt = require('jsonwebtoken');
@UseGuards(AuthGuard)
@Controller()
export class TutorialsController {
  constructor(private readonly tutorialsService: TutorialsService) {}

  @Roles([EUserRole.admin, EUserRole.teacher])
  @Post()
  create(
    @Body() createTutorialDto: CreateTutorialDto,
    @Cookies('token') token: string,
  ) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return this.tutorialsService.create(createTutorialDto, decoded.id);
  }

  @Get()
  async findAll(@PaginationParamDecorator() pagination: IPagination) {
    // console.log(pagination);
    return this.tutorialsService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param() id: string) {
    return this.tutorialsService.findOne(id);
  }

  @Roles([EUserRole.admin, EUserRole.teacher])
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTutorialDto: UpdateTutorialDto,
    @Cookies('token') token: string,
  ) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return this.tutorialsService.update(id, updateTutorialDto, decoded.id);
  }

  @Roles([EUserRole.admin, EUserRole.teacher])
  @Delete(':id')
  remove(@Param('id') id: string, @Cookies('token') token: string) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return this.tutorialsService.remove(id, decoded.id);
  }
}
