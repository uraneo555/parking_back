import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateParkingDetailDto } from './dto/create-parking-detail.dto';
import { UpdateParkingDetailDto } from './dto/update-parking-detail.dto';
import { ParkingDetail } from './entities/parking-detail.entity';
import { LogsService } from 'src/logs_parking/logs.service';

@Injectable()
export class ParkingDetailsService {


  constructor(
    @InjectModel(ParkingDetail)
    private readonly repositoryModel: typeof ParkingDetail,
    private readonly logger: LogsService
  ) { }


  async update(createParkingDetailDto: CreateParkingDetailDto) {
    await this.repositoryModel.upsert(
      {
        id: 1,
        capacidad_parking: createParkingDetailDto.capacidad_parking
      });

    return await this.repositoryModel.findByPk(1);
  }

  async findAll() {
    const datos = await this.repositoryModel.findByPk(1);
    if (datos) {
      return datos;
    } else {
      throw new BadRequestException("No se a definido los valores iniciales del parking.")
    }
  }
  
  async get() {
    return await this.findAll();
  }

  async ocupacion_actual() {
    const datos = await this.repositoryModel.findByPk(1);
    if (datos) {
      return {ocupacion_actual:datos.ocupacion_actual};
    } else {
      throw new BadRequestException("No se a definido valor para capacidad_parking")
    }
  }

  async entrada_vehiculo() {
    const datos = await this.repositoryModel.findByPk(1);
    if (datos) {
      datos.ocupacion_actual++;
      datos.save();
      this.logger.create({ accion: "entrada_vehiculo" })
    } else {
      throw new BadRequestException("No se a definido valor para capacidad_parking")
    }
  }
  async salida_vehiculo() {
    const datos = await this.repositoryModel.findByPk(1);
    if (datos) {
      if (datos.ocupacion_actual > 0) {
        datos.ocupacion_actual--;
        datos.save();
        this.logger.create({ accion: "salida_vehiculo" })
      }else {
        throw new ConflictException("La ocupación actual del parking es cero.")
      }
    } else {
      throw new BadRequestException("No se a definido valor para capacidad_parking")
    }
  }


}
