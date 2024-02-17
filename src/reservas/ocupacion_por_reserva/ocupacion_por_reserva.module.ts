import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OcupacionPorReserva } from './ocupacion_por_reserva';
import { OcupacionPorReservaService } from './ocupacion_por_reserva.service';

@Module({
  imports: [SequelizeModule.forFeature([OcupacionPorReserva])],
  providers: [OcupacionPorReservaService],
  exports: [OcupacionPorReservaService]
})
export class OcupacionPorReservaModule {}
