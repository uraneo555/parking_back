import { Table, Column, Model, Default } from 'sequelize-typescript';

@Table
export class ParkingDetail extends Model<ParkingDetail> {

    @Default(0)
    @Column
    capacidad_parking: number;

    @Default(0)
    @Column
    ocupacion_actual: number;
}
