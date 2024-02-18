import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, col, fn } from 'sequelize';
import { IOcupacionPorReserva } from './ocupacion_por_reserva';
import { OcupacionPorReserva } from './ocupacion_por_reserva.entity';

@Injectable()
export class OcupacionPorReservaService {

  constructor(
    @InjectModel(OcupacionPorReserva)
    private readonly repositoryModel: typeof OcupacionPorReserva
  ) {
  }


  async update(fecha_y_hora_entradaNEW: Date, fecha_y_hora_salidaNEW: Date,
    fecha_y_hora_entradaOLD: Date, fecha_y_hora_salidaOLD: Date) {
    await this.acuparPlaza(fecha_y_hora_entradaNEW, fecha_y_hora_salidaNEW)
    await this.liberarPlaza(fecha_y_hora_entradaOLD, fecha_y_hora_salidaOLD)
  }


  async sePuedeIntercambiar(capacidad_parking: number,
    fecha_y_hora_entradaNEW: Date, fecha_y_hora_salidaNEW: Date,
    fecha_y_hora_entradaOLD: Date, fecha_y_hora_salidaOLD: Date) {
    let result = true


    console.log();

    const findAll = await this.repositoryModel.findAll({
      where: {
        [Op.and]: [
          { ocupacion: { [Op.gte]: capacidad_parking } },
          {
            [Op.and]: [
              { momento: { [Op.gte]: fecha_y_hora_entradaNEW } },
              { momento: { [Op.lt]: fecha_y_hora_salidaNEW } }
            ]
          }
        ]
      }
    })

    console.log();

    if (findAll.length > 0) {
      if (findAll.some((value) => { 
        return fecha_y_hora_entradaOLD > value.momento && value.momento >= fecha_y_hora_salidaOLD })) {
        result = false
      }
    }

    console.log();


    return result;
  }

  async acuparPlaza(fecha_y_hora_entrada: Date, fecha_y_hora_salida: Date) {

    let momentosACrearMat = new Map<string, Date>()

    let datetemp = new Date(fecha_y_hora_entrada)

    do {
      momentosACrearMat.set(datetemp.toString(), datetemp)
      datetemp = new Date(datetemp)
      datetemp.setHours(datetemp.getHours() + 1);
    } while (datetemp < fecha_y_hora_salida);


    const findAll = await this.repositoryModel.findAll({
      where: {
        [Op.and]: [
          { momento: { [Op.gte]: fecha_y_hora_entrada } },
          { momento: { [Op.lt]: fecha_y_hora_salida } }
        ]
      }
    })

    findAll.forEach(apr => {
      momentosACrearMat.delete(apr.momento.toString());
    })

    if (momentosACrearMat.size > 0) {

      let momentosACrear = new Array<IOcupacionPorReserva>()

      momentosACrearMat.forEach(date => {
        momentosACrear.push({ momento: date, ocupacion: 0 })
      })

      await this.repositoryModel.bulkCreate(momentosACrear)

    }

    await this.repositoryModel.increment('ocupacion',
      {
        where: {
          [Op.and]: [
            { momento: { [Op.gte]: fecha_y_hora_entrada } },
            { momento: { [Op.lt]: fecha_y_hora_salida } }
          ]
        }
      })

  }

  async liberarPlaza(fecha_y_hora_entrada: Date, fecha_y_hora_salida: Date) {

    await this.repositoryModel.decrement('ocupacion',
      {
        where: {
          [Op.and]: [
            { momento: { [Op.gte]: fecha_y_hora_entrada } },
            { momento: { [Op.lt]: fecha_y_hora_salida } }
          ]
        }
      })

  }

  async plazaDisponible2(fecha_y_hora_entrada: Date,
    fecha_y_hora_salida: Date,
    capacidad_parking: number) {

    const count = await this.repositoryModel.count({
      where: {
        [Op.and]: [
          { ocupacion: { [Op.gte]: capacidad_parking } },
          {
            [Op.and]: [
              { momento: { [Op.gte]: fecha_y_hora_entrada } },
              { momento: { [Op.lt]: fecha_y_hora_salida } }
            ]
          }
        ]
      }
    })

    let result = true;
    if (count > 0) {
      result = false;
    }

    console.log(`
    
    OcupacionPorReservaService => plazaDisponible2 => result => ${result} 
    
    
    `);


    return result;
  }


}
