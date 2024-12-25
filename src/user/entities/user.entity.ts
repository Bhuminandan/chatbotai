import { ROLENAMES } from 'src/utils';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  mobile_number: string;

  @Column()
  username: string;

  @Column({
    type: 'enum',
    enum: ROLENAMES,
    default: ROLENAMES.USER,
  })
  role: ROLENAMES;

  @Column({ nullable: true, unique: true })
  email: string | null;

  @Column()
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
