import { Column, DataType, Default, Model, Table } from "sequelize-typescript";
import { RolesEnum } from "src/users/role.enum";
import * as bcrypt from 'bcrypt';

@Table
export class User extends Model<User> {


  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compareSync(password, this.password);
  }
  
  // @PrimaryGeneratedColumn('uuid')
  // readonly userId: string;

  @Default(RolesEnum.EMPLEADO)
  @Column({
    type: DataType.ENUM,
    values: Object.values(RolesEnum),
    // default: RolesEnum.USER.toString(),
    // default: 
    allowNull: false,
  })
  role: RolesEnum;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false
  })
  name: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false
  })
  email: string;

  
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false
  })
  telefono: string;  

  // @Column({ nullable: false, select: false })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false
  })
  password: string;

  // @DeleteDateColumn()
  // deletedAt: Date;
}
