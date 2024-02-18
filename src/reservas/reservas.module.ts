import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OcupacionPorReservaModule } from './ocupacion_por_reserva/ocupacion_por_reserva.module';
import { Reservas } from './entities/reserva.entity';
import { LogsModule } from 'src/logs_parking/logs.module';
import { ReservasController } from './reservas.controller';
import { ReservasService } from './reservas.service';
import { ParkingDetailsModule } from 'src/parking-details/parking-details.module';

@Module({
  imports: [SequelizeModule.forFeature([Reservas]), 
            LogsModule, OcupacionPorReservaModule, 
            ParkingDetailsModule],
  controllers: [ReservasController],
  providers: [ReservasService],
})
export class ReservasModule {}
