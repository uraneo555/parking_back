import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { OcupacionPorReservaService } from './ocupacion_por_reserva/ocupacion_por_reserva.service';
import { Reservas } from './entities/reserva.entity';
import { CreateReservasDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { LogsService } from 'src/logs_parking/logs.service';
import { ParkingDetail } from 'src/parking-details/entities/parking-detail.entity';
import { DatoResult } from 'src/utiles/dato_result.class';
import { ParkingDetailsService } from 'src/parking-details/parking-details.service';

@Injectable()
export class ReservasService {

  constructor(
    @InjectModel(Reservas)
    private readonly reservaModel: typeof Reservas,
    private readonly logger: LogsService,
    private readonly ocupacionPorReservaService: OcupacionPorReservaService,
    private readonly parkingDetailsService: ParkingDetailsService
  ) {
  }


  async create(createReservasDto: CreateReservasDto): Promise<Reservas> {

    this.ocupacionPorReservaService.acuparPlaza(
      createReservasDto.fecha_y_hora_entrada,
      createReservasDto.fecha_y_hora_salida);

    const reserva = new Reservas(createReservasDto);
    const reserva2 = await reserva.save();
    this.logger.create({ idCliente: createReservasDto.id_cliente, accion: "reservacion_realizada" })
    return reserva2;
  }

  async plazaDisponible2(createReservasDto: CreateReservasDto): Promise<boolean> {

    let capacidad_parking: number = await this.getCapacidadParking();

    const disponible: boolean = await this.ocupacionPorReservaService.plazaDisponible2(
      createReservasDto.fecha_y_hora_entrada,
      createReservasDto.fecha_y_hora_salida,
      capacidad_parking);

    return disponible;
  }

  private async getCapacidadParking() {
    const parkingDetail = await this.parkingDetailsService.get();
    let capacidad_parking: number = parkingDetail.capacidad_parking;
    return capacidad_parking;
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

  async findOne(id: number) {
    const reservaDB = await this.reservaModel.findByPk(id);
    this.excepSiNoExiste(reservaDB)
    return reservaDB;
  }

  async update(updateReservasDto: UpdateReservaDto) {
    const reservaDB = await this.reservaModel.findByPk(updateReservasDto.id);

    if (!reservaDB) {
      throw new BadRequestException("La reservación no existe. ")
    }

    if (reservaDB.id_cliente != updateReservasDto.id_cliente) {
      throw new ForbiddenException("Esta reservación no es suya.")
    }

    let capacidad_parking: number = await this.getCapacidadParking();

    const fecha_y_hora_entradaNEW: Date = updateReservasDto.fecha_y_hora_entrada;
    const fecha_y_hora_salidaNEW: Date = updateReservasDto.fecha_y_hora_salida;
    const fecha_y_hora_entradaOLD: Date = reservaDB.fecha_y_hora_entrada;
    const fecha_y_hora_salidaOLD: Date = reservaDB.fecha_y_hora_salida;


    if (fecha_y_hora_entradaNEW.toString() != fecha_y_hora_entradaOLD.toString() ||
      fecha_y_hora_salidaNEW.toString() != fecha_y_hora_salidaOLD.toString()) {
      if (await this.ocupacionPorReservaService.sePuedeIntercambiar(capacidad_parking,
        fecha_y_hora_entradaNEW, 
        fecha_y_hora_salidaNEW,
        fecha_y_hora_entradaOLD, 
        fecha_y_hora_salidaOLD)) {
        this.ocupacionPorReservaService.update(
          fecha_y_hora_entradaNEW, 
          fecha_y_hora_salidaNEW,
          fecha_y_hora_entradaOLD, 
          fecha_y_hora_salidaOLD)
      } else {
        throw new BadRequestException("El nuevo rango de tiempo solicitado no está disponible.");
      }
    }

    reservaDB.fecha_y_hora_entrada = fecha_y_hora_entradaNEW;
    reservaDB.fecha_y_hora_salida = fecha_y_hora_salidaNEW;

    if (updateReservasDto.chapa_vehiculo != undefined &&
      updateReservasDto.chapa_vehiculo != reservaDB.chapa_vehiculo) {
      reservaDB.chapa_vehiculo = updateReservasDto.chapa_vehiculo
    }

    if (updateReservasDto.color_vehiculo != undefined &&
      updateReservasDto.color_vehiculo != reservaDB.color_vehiculo) {
      reservaDB.color_vehiculo = updateReservasDto.color_vehiculo
    }

    const result: DatoResult = new DatoResult()
    result.dato = await reservaDB.save();
    result.message = "La reservación fue actualizada exitosamente."

    return result;
  }

  async remove(id: number, id_cliente: number) {

    const reservaDB = await this.reservaModel.findByPk(id);

    this.excepSiNoExiste(reservaDB)

    if (reservaDB.id_cliente != id_cliente) {
      throw new ForbiddenException("Esta reservación no es suya.")
    }

    await reservaDB.destroy();
    this.ocupacionPorReservaService.liberarPlaza(
      reservaDB.fecha_y_hora_entrada,
      reservaDB.fecha_y_hora_salida);
    this.logger.create({ idCliente: reservaDB.id_cliente, accion: "reservacion_cancelada" })

    const result: DatoResult = new DatoResult()
    result.dato = reservaDB
    result.message = "La reservación fue eliminada exitosamente."

    return result;
  }


  excepSiNoExiste(reserva: Reservas) {
    if (!reserva) {
      throw new BadRequestException(`La reservación no existe.`)
    }
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


  normalizarDateC(createReservasDto: CreateReservasDto) {
    createReservasDto.fecha_y_hora_entrada.setMinutes(0, 0, 0);
    createReservasDto.fecha_y_hora_salida.setMinutes(0, 0, 0);
    let hours = 1 + createReservasDto.fecha_y_hora_salida.getHours();
    createReservasDto.fecha_y_hora_salida.setHours(hours);
  }

  normalizarDateU(createReservasDto: UpdateReservaDto) {
    createReservasDto.fecha_y_hora_entrada.setMinutes(0, 0, 0);
    createReservasDto.fecha_y_hora_salida.setMinutes(0, 0, 0);
    let hours = 1 + createReservasDto.fecha_y_hora_salida.getHours();
    createReservasDto.fecha_y_hora_salida.setHours(hours);
  }

}
