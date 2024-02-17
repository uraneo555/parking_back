import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { OcupacionPorReserva } from './ocupacion_por_reserva';
import { IOcupacionPorReserva } from './ocupacion_por_reserva.entity';

@Injectable()
export class OcupacionPorReservaService {


  async acuparPlaza(fecha_y_hora_entrada: Date, fecha_y_hora_salida: Date) {

    let momentosACrearMat = new Map<string,Date>()

    let datetemp = new Date(fecha_y_hora_entrada)

    datetemp.toString()

    do {
      momentosACrearMat.set(datetemp.toString(), datetemp)
      datetemp = new Date(datetemp)
      datetemp.setHours(datetemp.getHours()+1);      
    } while (datetemp<fecha_y_hora_salida);


    const findAll =  await this.repositoryModel.findAll({where:{
      [Op.and]:[
        {momento:{[Op.gte]:fecha_y_hora_entrada}},
        {momento:{[Op.lt]:fecha_y_hora_salida}}
      ]      
    }})

    findAll.forEach(apr=>{
      momentosACrearMat.delete(apr.momento.toString());
    })


    if (momentosACrearMat.size>0) {

      let momentosACrear = new Array<IOcupacionPorReserva>()

      momentosACrearMat.forEach(date=>{
        momentosACrear.push({momento:date,ocupacion:0 })
      })
  
      await this.repositoryModel.bulkCreate(momentosACrear)
      
    }

    await this.repositoryModel.increment('ocupacion', 
    {
      where:{
        [Op.and]:[
          {momento:{[Op.gte]:fecha_y_hora_entrada}},
          {momento:{[Op.lt]:fecha_y_hora_salida}}
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
            [Op.and]:[
              {momento:{[Op.gte]:fecha_y_hora_entrada}},
              {momento:{[Op.lt]:fecha_y_hora_salida}}
            ]
          }
        ]
      }
    })

    let result = true;
    if (count>0) {
      result = false;
    }

    console.log(`
    
    OcupacionPorReservaService => plazaDisponible2 => result => ${result} 
    
    
    `);
    

    return result;
  }

  constructor(
    @InjectModel(OcupacionPorReserva)
    private readonly repositoryModel: typeof OcupacionPorReserva
  ) {
  }

}
