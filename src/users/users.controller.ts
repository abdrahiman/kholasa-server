import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import {
  CreateUserDto,
  FilterUserstDto,
  UpdateUserDto,
} from './dtos/users.dto';
import { IsMongoIdPipe } from 'src/common';
import { UsersService } from './users.service';
import { Role, Roles } from 'src/auth/decorator/roles.decorator';
import { Public } from 'src/auth/decorator/public.decorator';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Public()
  @Get()
  findMany(@Query() params: FilterUserstDto) {
    return this.usersService.findMany(params);
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  async findById(@Param('id', IsMongoIdPipe) id: string) {
    return await this.usersService.findById(id);
  }

  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() payload: CreateUserDto) {
    return await this.usersService.create(payload);
  }

  @Roles(Role.ADMIN)
  @Put(':id')
  async update(
    @Param('id', IsMongoIdPipe) id: string,
    @Body() payload: UpdateUserDto,
  ) {
    return await this.usersService.update(id, payload);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id', IsMongoIdPipe) id: string) {
    return await this.usersService.remove(id);
  }
}
