import {
    Prop,
    Schema,
    SchemaFactory
} from '@nestjs/mongoose';
import {
    Document
} from 'mongoose';

export type LogDocument = Log & Document;

@Schema()
export class Log {

    @Prop()
    accion: string;

    @Prop()
    idCliente: number;

    @Prop()
    ocurencia?: Date;

}

export const LogSchema = SchemaFactory.createForClass(Log);