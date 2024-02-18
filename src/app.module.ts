import { Module } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();
import { UsersModule } from './users/users.module';

import { MongooseModule } from '@nestjs/mongoose';
import { SequelizeModule } from '@nestjs/sequelize';
import { ParkingDetailsModule } from './parking-details/parking-details.module';


import { ConfigModule } from '@nestjs/config';
import { LogsModule } from './logs_parking/logs.module';
import { AuthModule } from './auth/auth.module';
import { OcupacionPorReservaModule } from './reservas/ocupacion_por_reserva/ocupacion_por_reserva.module';
import { ReservasModule } from './reservas/reservas.module';


@Module({
  imports: [ 
    // ConfigModule.forRoot({
    //   isGlobal: true,
    // }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadModels: true,
      synchronize: JSON.parse(process.env.DB_SYNC),
    }),

    MongooseModule.forRoot(`mongodb://${process.env.MONGO_IP}:${process.env.MONGO_PORT}/${process.env.DB_NAME}`, {
      connectionFactory: (connection) => {
        connection.on('connected', () => {
           console.log(`is connected => MongooseModule`);
        });
        connection._events.connected();
        return connection;
        },
      },
    ),

    LogsModule, AuthModule, 
    UsersModule, ReservasModule, 
    ParkingDetailsModule, OcupacionPorReservaModule
  ],
  controllers: [],
  providers: [],
  exports:[]
})
export class AppModule {}
