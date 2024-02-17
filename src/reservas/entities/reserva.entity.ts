import { Table, Column, Model } from 'sequelize-typescript';

@Table
export class Reservas extends Model<Reservas> {

    @Column
    id_cliente: number;

    @Column
    chapa_vehiculo: string;

    @Column
    color_vehiculo: string;

    @Column
    fecha_y_hora_entrada: Date;

    @Column
    fecha_y_hora_salida: Date;

}

