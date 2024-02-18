import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LogsService } from './logs.service';
import { RolesEnum } from 'src/users/role.enum';
import { AuthRolesGuard } from 'src/auth/auth_roles.guard';

@Controller('logs')
@AuthRolesGuard(RolesEnum.ADMIN)
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  // @Post()
  // create(@Body() createLogDto: CreateLogDto) {
  //   return this.logsService.create(createLogDto);
  // }

  @Get()
  findAll() {
    return this.logsService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.logsService.findOne(id);
  // }

  // @Patch()
  // update(@Body() updateLogDto: UpdateLogDto) {
  //   return this.logsService.update(updateLogDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.logsService.remove(id);
  // }
}
