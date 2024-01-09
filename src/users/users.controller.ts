import { PaginationParamDecorator } from 'src/decorators/pagination.decorator';
import { Roles } from 'src/decorators/role.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { EUserRole, IPagination } from 'src/shared/common.constants';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Roles([EUserRole.admin, EUserRole.superadmin])
  @Get()
  async findAll(@PaginationParamDecorator() pagination: IPagination) {
    return this.usersService.findAll(pagination);
  }

  @Get(':id')
  async findOne(@Param() id: string) {
    return this.usersService.findOne(id);
  }
  @Patch(':id')
  async update(@Param() id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(id, body);
  }
  @Delete(':id')
  async delete(@Param() id: string) {
    return this.usersService.delete(id);
  }

  @Post()
  create(user: CreateUserDto) {
    return this.usersService.create(user);
  }
}
