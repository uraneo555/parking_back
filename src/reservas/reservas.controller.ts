import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException } from '@nestjs/common';
import { RolesEnum } from 'src/users/role.enum';
import { AuthRolesGuard } from 'src/auth/auth_roles.guard';
import { CreateReservasDto } from './dto/create-reserva.dto';
import { ReservasService } from './reservas.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateReservaDto } from './dto/update-reserva.dto';

@Controller('reservas')
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) { }


  @Post()
  @AuthRolesGuard(RolesEnum.CLIENTE)
  async create(@Body() createReservas2Dto: CreateReservasDto) {

    createReservas2Dto.fecha_y_hora_entrada = new Date(createReservas2Dto.fecha_y_hora_entrada)
    createReservas2Dto.fecha_y_hora_salida = new Date(createReservas2Dto.fecha_y_hora_salida)
    var today = new Date();

    // console.log(`                                 today  => ${today.toString()}`);
    // console.log(`createReservas2Dto.fecha_y_hora_entrada => ${createReservas2Dto.fecha_y_hora_entrada.toString()}`);
    // console.log(`createReservas2Dto.fecha_y_hora_salida  => ${createReservas2Dto.fecha_y_hora_salida.toString()}`);


    if (createReservas2Dto.fecha_y_hora_entrada >= createReservas2Dto.fecha_y_hora_salida) {
      throw new BadRequestException("La fecha de entrada de la reservacion tiene que ser menor que la de salida");
    }
    else if (createReservas2Dto.fecha_y_hora_entrada < today) {
      throw new BadRequestException("La fecha de inicio de la reservacion debe ser mavor que la hora actual");
    }
    else if (
      Math.round((createReservas2Dto.fecha_y_hora_salida.getTime() -
        createReservas2Dto.fecha_y_hora_entrada.getTime()) / (1000 * 60)) < 60) {
      throw new BadRequestException(`La reservaciòn debe ser para màs de una hora`);
    } else {

      this.reservasService.normalizarDate(createReservas2Dto);

      if (await this.reservasService.plazaDisponible2(createReservas2Dto)) {
        return this.reservasService.create(createReservas2Dto);
      } else {
      throw new BadRequestException("No hay plasas disponibles para el rango de tiempo solicitado");
      }
    }
  }

  @Get('ocupacion_actual')
  @AuthRolesGuard(RolesEnum.EMPLEADO)
  ocupacion_actual() {
    var today = new Date();
    return this.reservasService.ocupacion_actual(today);
  }

  @Get()
  @AuthRolesGuard(RolesEnum.ADMIN)
  findAll() {
    return this.reservasService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.reservasService.findOne(+id);
  }

  @Patch(':id')

  update(@Param('id') id: string, @Body() updateReservas2Dto: UpdateReservaDto) {
    return this.reservasService.update(+id, updateReservas2Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservasService.remove(+id);
  }
}
