import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { CreateReservasDto } from 'src/reservas/dto/create-reserva.dto';

describe('pruebas e2e automatizadas para los 3 casos de uso', () => {
  let app: INestApplication;
  let jwt_admin: String;
  let jwt_empleado: String;
  let jwt_cliente: String;
  let ocupacionActua: number;
  let id_cliente: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

  });


  it('Crear y logear un admin', async () => {

    let uuuu: String = uuidv4();
    uuuu = uuuu.toUpperCase().replaceAll("-", "");

    const newUser = {
      name: `admin_${uuuu}_admin`,
      email: `admin_${uuuu}_admin@gmail.com`,
      telefono: '+53' + Math.floor(Math.random() * 100000000),
      password: uuuu,
      role: 'admin',
    };

    // console.log();

    try {

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(newUser)
        .expect(201)
        .expect(({ body }) => {
          expect(body.message).toEqual("User created successfully");
          expect(body.newUser.name).toEqual(newUser.name);
          expect(body.newUser.email).toEqual(newUser.email);
          expect(body.newUser.role).toEqual(newUser.role);
        });


      await request(app.getHttpServer())
        .post('/auth/login')
        .send(newUser)
        .expect(200)
        .expect(({ body }) => {
          expect(body.email).toEqual(newUser.email);
          expect(body.token).toBeTruthy();
          jwt_admin = body.token;
        });

    } catch (error) {

      // console.log(error);

      throw error

    }


  });

  it('Crear y logear un empleado', async () => {

    let uuuu: String = uuidv4();
    uuuu = uuuu.toUpperCase().replaceAll("-", "");

    const newUser = {
      name: `empleado_${uuuu}_empleado`,
      email: `empleado_${uuuu}_empleado@gmail.com`,
      telefono: '+53' + Math.floor(Math.random() * 100000000),
      password: uuuu,
      role: 'empleado'
    };

    await request(app.getHttpServer())
      .post('/auth/register')
      .send(newUser)
      .expect(201)
      .expect(({ body }) => {
        expect(body.message).toEqual("User created successfully");
        expect(body.newUser.name).toEqual(newUser.name);
        expect(body.newUser.email).toEqual(newUser.email);
        expect(body.newUser.telefono).toEqual(newUser.telefono);
        expect(body.newUser.role).toEqual(newUser.role);
        expect(body.newUser.password).toBeUndefined();
      });


    await request(app.getHttpServer())
      .post('/auth/login')
      .send(newUser)
      .expect(200)
      .expect(({ body }) => {
        expect(body.email).toEqual(newUser.email);
        expect(body.token).toBeTruthy();
        jwt_empleado = body.token;
      });



  });


  it('Crear y logear un cliente', async () => {

    let uuuu: String = uuidv4();
    uuuu = uuuu.toUpperCase().replaceAll("-", "");

    const newUser = {
      name: `cliente_${uuuu}_cliente`,
      email: `cliente_${uuuu}_cliente@gmail.com`,
      telefono: '+53' + Math.floor(Math.random() * 100000000),
      password: uuuu,
      role: 'cliente'
    };

    await request(app.getHttpServer())
      .post('/auth/register')
      .send(newUser)
      .expect(201)
      .expect(({ body }) => {
        expect(body.message).toEqual("User created successfully");
        expect(body.newUser.name).toEqual(newUser.name);
        expect(body.newUser.email).toEqual(newUser.email);
        expect(body.newUser.telefono).toEqual(newUser.telefono);
        expect(body.newUser.role).toEqual(newUser.role);
        expect(body.newUser.password).toBeUndefined();
        id_cliente = body.newUser.id;
      });

    await request(app.getHttpServer())
      .post('/auth/login')
      .send(newUser)
      .expect(200)
      .expect(({ body }) => {
        expect(body.email).toEqual(newUser.email);
        expect(body.token).toBeTruthy();
        jwt_cliente = body.token;
      });

  });

  it('Crear los detalles del parking', async () => {
    await request(app.getHttpServer())
      .post('/details/set')
      .set("authorization", `Bearer ${jwt_admin}`)
      .send({ capacidad_parking: 1111 })
      .expect(201)
      .expect(({ body }) => {
        expect(body).toBeTruthy()
        ocupacionActua = body.ocupacion_actual;
      });
  })

  it('Reservar una plaza de aparcamiento', async () => {

    const createReservas2Dto: CreateReservasDto = new CreateReservasDto();

    let uuuu: String = uuidv4();
    uuuu = uuuu.toUpperCase().replaceAll("-", "");

    createReservas2Dto.chapa_vehiculo = uuuu.toString();
    createReservas2Dto.color_vehiculo = 'red'
    createReservas2Dto.id_cliente = id_cliente;
    const fecha_y_hora_entrada = new Date()
    fecha_y_hora_entrada.setHours(fecha_y_hora_entrada.getHours()+1)
    createReservas2Dto.fecha_y_hora_entrada = fecha_y_hora_entrada
    let fecha_y_hora_salida = new Date()
    fecha_y_hora_salida.setHours(33)
    createReservas2Dto.fecha_y_hora_salida = fecha_y_hora_salida

    await request(app.getHttpServer())
      .post('/reservas')
      .set("authorization", `Bearer ${jwt_cliente}`)
      .send(createReservas2Dto)
      .expect(201)
      .expect(({ body }) => {
        expect(body).toBeTruthy()
        expect(body.id_cliente).toEqual(id_cliente)
      });
  });

  it('Simular entrada de vehiculo', async () => {
    await request(app.getHttpServer())
      .get('/details/entrada_vehiculo')
      .set("authorization", `Bearer ${jwt_empleado}`)
      .expect(200)
  })

  it('Primera consulta de la ocupacion del parking', async () => {
    await request(app.getHttpServer())
      .get('/details/ocupacion_actual')
      .set("authorization", `Bearer ${jwt_empleado}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toBeTruthy()
        expect(body.ocupacion_actual).toBeGreaterThanOrEqual(0)
        expect(body.ocupacion_actual).toEqual(ocupacionActua + 1)
      });
  })

  it('Simular salida de vehiculo', async () => {
    await request(app.getHttpServer())
      .get('/details/salida_vehiculo')
      .set("authorization", `Bearer ${jwt_empleado}`)
      .expect(200)
  })

  it('Segunda consulta de la ocupacion del parking', async () => {
    await request(app.getHttpServer())
      .get('/details/ocupacion_actual')
      .set("authorization", `Bearer ${jwt_empleado}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toBeTruthy()
        expect(body.ocupacion_actual).toBeGreaterThanOrEqual(0)
        expect(body.ocupacion_actual).toEqual(ocupacionActua)
      });
  })


  it('Actualizar los detalles de un usuario', async () => {

    let userPrueba: UpdateUserDto;

    await request(app.getHttpServer())
      .get('/users')
      .set("authorization", `Bearer ${jwt_admin}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toBeTruthy()
        expect(body.length).toBeGreaterThan(0);
        userPrueba = body[0];
      });

    let uuuu: String = uuidv4();
    uuuu = uuuu.toUpperCase().replaceAll("-", "");

    userPrueba.name = `usuario_modificado_${uuuu}_usuario_modificado`;
    userPrueba.email = `usuario_modificado_${uuuu}_usuario_modificado@gmail.com`;
    userPrueba.telefono = '+53' + Math.floor(Math.random() * 100000000);

    await request(app.getHttpServer())
      .patch('/users')
      .set("authorization", `Bearer ${jwt_admin}`)
      .send(userPrueba)
      .expect(200)
      .expect(({ body }) => {

        expect(body).toBeTruthy();

        expect(body.name).toEqual(userPrueba.name);
        expect(body.email).toEqual(userPrueba.email);
        expect(body.telefono).toEqual(userPrueba.telefono);

      });
  });

  afterAll(async () => {
    await app.close();
  });


});
