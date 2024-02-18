import { Module } from '@nestjs/common';
import { ParkingDetailsService } from './parking-details.service';
import { ParkingDetailsController } from './parking-details.controller';
import { ParkingDetail } from './entities/parking-detail.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { LogsModule } from 'src/logs_parking/logs.module';

@Module({
  imports: [SequelizeModule.forFeature([ParkingDetail]), LogsModule],
  controllers: [ParkingDetailsController],
  exports: [ParkingDetailsService],
  providers: [ParkingDetailsService],
})
export class ParkingDetailsModule {}
