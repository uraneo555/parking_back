import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { OcupacionPorReservaService } from './ocupacion_por_reserva/ocupacion_por_reserva.service';
import { Reservas } from './entities/reserva.entity';
import { CreateReservasDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';

@Injectable()
export class ReservasService {

    


  constructor(
    @InjectModel(Reservas)
    private readonly reservaModel: typeof Reservas,
    private readonly logger: LogsService,
    private readonly ocupacionPorReservaService: OcupacionPorReservaService
  ) { 
  }


  async create(createReservas2Dto: CreateReservasDto): Promise<Reservas> {
    
    this.ocupacionPorReservaService.acuparPlaza(
      createReservas2Dto.fecha_y_hora_entrada, 
      createReservas2Dto.fecha_y_hora_salida);

    const reserva = new Reservas(createReservas2Dto);
    const reserva2 = await reserva.save();
    this.logger.create({idCliente:createReservas2Dto.id_cliente, accion:"reservacion_realizada" })
    return reserva2;
  }


  normalizarDate(createReservas2Dto: CreateReservasDto) {
    createReservas2Dto.fecha_y_hora_entrada.setMinutes(0, 0, 0);
    createReservas2Dto.fecha_y_hora_salida.setMinutes(0, 0, 0);
    let hours = createReservas2Dto.fecha_y_hora_salida.getHours();
    hours++;
    createReservas2Dto.fecha_y_hora_salida.setHours(hours);
  }

  async plazaDisponible2(createReservas2Dto: CreateReservasDto): Promise<boolean> {
    let capacidad_parking: number = 1;

    const parkingDetail = await ParkingDetail.findByPk(1);
    if (parkingDetail) {
      capacidad_parking = parkingDetail.capacidad_parking;
    }

    const disponible: boolean = await this.ocupacionPorReservaService.plazaDisponible2(
      createReservas2Dto.fecha_y_hora_entrada,
      createReservas2Dto.fecha_y_hora_salida,
      capacidad_parking);

    return disponible;
  }

  async plazaDisponible(createReservaDto: CreateReservasDto): Promise<boolean> {

    let capacidad_parking: number = 1;

    const parkingDetail = await ParkingDetail.findByPk(1);
    if (parkingDetail) {
      capacidad_parking = parkingDetail.capacidad_parking;
    }

    // console.log(`Reservas2Service => capacidad_parking = ${capacidad_parking}`);

    const cantidadCoincidencia = await this.reservaModel.findAndCountAll(
      {
        where: {
          [Op.or]: [
            {
              [Op.and]: [
                { fecha_y_hora_entrada: { [Op.lte]: createReservaDto.fecha_y_hora_entrada } },
                { fecha_y_hora_salida: { [Op.gt]: createReservaDto.fecha_y_hora_entrada } }
              ]
            },
            {
              [Op.and]: [
                { fecha_y_hora_entrada: { [Op.lt]: createReservaDto.fecha_y_hora_salida } },
                { fecha_y_hora_salida: { [Op.gte]: createReservaDto.fecha_y_hora_salida } }
              ]
            },
            {
              [Op.and]: [
                { fecha_y_hora_entrada: { [Op.gt]: createReservaDto.fecha_y_hora_entrada } },
                { fecha_y_hora_salida: { [Op.lt]: createReservaDto.fecha_y_hora_salida } }
              ]
            }
          ]
        }
      })

    console.log(`
    Reservas2Service => capacidad_parking = ${capacidad_parking}
    Reservas2Service => cantidadCoincidencia = ${cantidadCoincidencia.count}
    `);

    return cantidadCoincidencia.count < capacidad_parking;
  }

  async ocupacion_actual(today: Date) {
    const cantidadCoincidencia = await this.reservaModel.findAndCountAll(
      {
        where: {
          [Op.and]: [
            { fecha_y_hora_entrada: { [Op.lte]: today } },
            { fecha_y_hora_salida: { [Op.gt]: today } }
          ]
        }
      });

    return cantidadCoincidencia.count;
  }


  findAll() {
    return this.reservaModel.findAll();
  }

  findOne(id: number) {
    return this.reservaModel.findByPk(id);
  }

  update(id: number, updateReservas2Dto: UpdateReservaDto) {
    return `This action updates a #${id} reservas2`;
  }

  async remove(id: number) {

    const row = await Reservas.findOne({ where: { id } });
    if (row) {
      await row.destroy();
    this.logger.create({idCliente:row.id_cliente, accion:"reservacion_cancelada" })
  }

    return row;
  }
}
