import { Module } from '@nestjs/common';
import { ParkingDetailsService } from './parking-details.service';
import { ParkingDetailsController } from './parking-details.controller';
import { ParkingDetail } from './entities/parking-detail.entity';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([ParkingDetail]), LogsModule],
  controllers: [ParkingDetailsController],
  providers: [ParkingDetailsService],
})
export class ParkingDetailsModule {}
