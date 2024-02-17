import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParkingDetailsService } from './parking-details.service';
import { CreateParkingDetailDto } from './dto/create-parking-detail.dto';
import { RolesEnum } from 'src/users/role.enum';
import { AuthRolesGuard } from 'src/auth/auth_roles.guard';

@Controller('details')
export class ParkingDetailsController {
  constructor(private readonly parkingDetailsService: ParkingDetailsService) {}

  @Post('set')
  @AuthRolesGuard(RolesEnum.ADMIN)
  update(@Body() createParkingDetailDto: CreateParkingDetailDto) {
    return this.parkingDetailsService.update(createParkingDetailDto);
  }

  @Get()
  @AuthRolesGuard(RolesEnum.EMPLEADO)
  get() {
    return this.parkingDetailsService.findAll();
  }

  @Get('entrada_vehiculo')
  @AuthRolesGuard(RolesEnum.EMPLEADO)
  entrada_vehiculo(){
    return this.parkingDetailsService.entrada_vehiculo();
  }

  @Get('salida_vehiculo')
  @AuthRolesGuard(RolesEnum.EMPLEADO)
  salida_vehiculo(){
    return this.parkingDetailsService.salida_vehiculo();
  }

  @Get('ocupacion_actual')
  @AuthRolesGuard(RolesEnum.EMPLEADO)
  ocupacion_actual() {
    return this.parkingDetailsService.ocupacion_actual();
  }

}
