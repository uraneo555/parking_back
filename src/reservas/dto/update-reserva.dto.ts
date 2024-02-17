import { PartialType } from '@nestjs/swagger';
import { CreateReservasDto } from './create-reserva.dto';

export class UpdateReservaDto extends PartialType(CreateReservasDto) {}
