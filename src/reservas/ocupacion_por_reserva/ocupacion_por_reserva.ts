import { Table, Column, Model, Default } from 'sequelize-typescript';

@Table
export class OcupacionPorReserva extends Model<OcupacionPorReserva>  {

    @Default(0)
    @Column
    ocupacion: number;

    @Column
    momento: Date;

}
