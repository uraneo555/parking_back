import { PartialType } from '@nestjs/swagger';
import { CreateParkingDetailDto } from './create-parking-detail.dto';

export class UpdateParkingDetailDto extends PartialType(CreateParkingDetailDto) {}
