import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from './decorators/user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @Auth()
  async getProfile(@CurrentUser('id') id: string) {
    return this.usersService.getOne(id);
  }

  // ADMIN
  @Get()
  @Auth('admin')
  async getAll() {
    return this.usersService.getAll();
  }

  @Get(':id')
  @Auth('admin')
  async getById(@Param('id') id: string) {
    return this.usersService.getById(id);
  }

  @Patch(':id')
  @Auth('admin')
  @UsePipes(new ValidationPipe())
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return await this.usersService.update(id, dto);
  }

  @Delete(':id')
  @Auth('admin')
  async delete(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
