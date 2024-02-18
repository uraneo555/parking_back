import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OcupacionPorReservaService } from './ocupacion_por_reserva.service';
import { OcupacionPorReserva } from './ocupacion_por_reserva.entity';

@Module({
  imports: [SequelizeModule.forFeature([OcupacionPorReserva])],
  providers: [OcupacionPorReservaService],
  exports: [OcupacionPorReservaService]
})
export class OcupacionPorReservaModule {}
