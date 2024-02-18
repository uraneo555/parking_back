import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException, Req } from '@nestjs/common';
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
  async create(@Body() createReservas2Dto: CreateReservasDto, @Req() req) {

    this.validadReservacionC(createReservas2Dto, req);

    if (await this.reservasService.plazaDisponible2(createReservas2Dto)) {
      return this.reservasService.create(createReservas2Dto);
    } else {
    throw new BadRequestException("No hay plasas disponibles para el rango de tiempo solicitado");
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

  @Patch()
  @AuthRolesGuard(RolesEnum.CLIENTE)
  update(@Body() updateReservasDto: UpdateReservaDto, @Req() req) {
    this.validadReservacionU(updateReservasDto, req)
    return this.reservasService.update(updateReservasDto);
  }

  @Delete(':id')
  @AuthRolesGuard(RolesEnum.CLIENTE)
  remove(@Param('id') id: string, @Req() req) {
    const id_cliente:number = req.user.id;
    return this.reservasService.remove(+id, id_cliente);
  }







  private validadReservacionC(reservasDto: CreateReservasDto, req) {

    if (!reservasDto.fecha_y_hora_entrada || !reservasDto.fecha_y_hora_salida) {
      throw new BadRequestException("La fecha de entrada y salida tienen que estar definida.")
    }

    reservasDto.fecha_y_hora_entrada = new Date(reservasDto.fecha_y_hora_entrada)
    reservasDto.fecha_y_hora_salida = new Date(reservasDto.fecha_y_hora_salida)
    var today = new Date();

    if (reservasDto.fecha_y_hora_entrada >= reservasDto.fecha_y_hora_salida) {
      throw new BadRequestException("La fecha de entrada de la reservacion tiene que ser menor que la de salida");
    }
    else if (reservasDto.fecha_y_hora_entrada < today) {
      throw new BadRequestException("La fecha de inicio de la reservacion debe ser mavor que la hora actual");
    }
    else if (Math.round((reservasDto.fecha_y_hora_salida.getTime() -
      reservasDto.fecha_y_hora_entrada.getTime()) / (1000 * 60)) < 60) {
      throw new BadRequestException(`La reservaciòn debe ser para màs de una hora`);
    }    

    reservasDto.id_cliente = req.user.id      

    this.reservasService.normalizarDateC(reservasDto);
  }

  private validadReservacionU(reservasDto: UpdateReservaDto, req) {

    if (!reservasDto.fecha_y_hora_entrada || !reservasDto.fecha_y_hora_salida) {
      throw new BadRequestException("La fecha de entrada y salida tienen que estar definida.")
    }

    reservasDto.fecha_y_hora_entrada = new Date(reservasDto.fecha_y_hora_entrada)
    reservasDto.fecha_y_hora_salida = new Date(reservasDto.fecha_y_hora_salida)
    var today = new Date();

    if (reservasDto.fecha_y_hora_entrada >= reservasDto.fecha_y_hora_salida) {
      throw new BadRequestException("La fecha de entrada de la reservacion tiene que ser menor que la de salida");
    }
    else if (reservasDto.fecha_y_hora_entrada < today) {
      throw new BadRequestException("La fecha de inicio de la reservacion debe ser mavor que la hora actual");
    }
    else if (Math.round((reservasDto.fecha_y_hora_salida.getTime() -
      reservasDto.fecha_y_hora_entrada.getTime()) / (1000 * 60)) < 60) {
      throw new BadRequestException(`La reservaciòn debe ser para màs de una hora`);
    }    

    reservasDto.id_cliente = req.user.id      

    this.reservasService.normalizarDateU(reservasDto);
  }


}
