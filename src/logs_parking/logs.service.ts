import {  Injectable} from '@nestjs/common';
import {  InjectModel} from '@nestjs/mongoose';
import {   Model} from 'mongoose';
import { UpdateLogDto} from './dto/update-log.dto';
import { CreateLogDto} from './dto/create-log.dto';
import { Log, LogDocument } from './entities/log.entity';

@Injectable()
export class LogsService {

  constructor(
    @InjectModel(Log.name) 
    private readonly repositoryModel: Model < LogDocument> 
    ) {}

  async create(createEmployeeDto: CreateLogDto): Promise < LogDocument > {
    createEmployeeDto.ocurencia = new Date();
    const employee = new this.repositoryModel(createEmployeeDto);
    return employee.save();
  }

  async findAll(): Promise < LogDocument[] > {
    return await this.repositoryModel.find();
  }

  async findOne(id: string) {
    return this.repositoryModel.findById(id);
  }

  async update(updateEmployeeDto: UpdateLogDto): Promise < LogDocument > {
    return await this.repositoryModel.findByIdAndUpdate(updateEmployeeDto.id, updateEmployeeDto);
  }
  
  async remove(id: string) {
    return await this.repositoryModel.findByIdAndDelete(id);//findByIdAndRemove
  }

}
