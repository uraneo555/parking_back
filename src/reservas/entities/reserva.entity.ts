import { Table, Column, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from 'src/users/entities/user.entity';

@Table
export class Reservas extends Model<Reservas> {

    @ForeignKey(() => User)
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

    @BelongsTo(() => User)
    user: User;

}

