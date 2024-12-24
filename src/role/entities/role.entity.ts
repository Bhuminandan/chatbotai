import {RoleFeature} from 'src/role-feature/entities/role-feature.entity';
import {User} from 'src/user/entities/user.entity';
import {ROLESNAME} from 'src/utils';
import {Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';


@Entity({
  name: 'user_role'
})
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'enum', unique: true, enum: ROLESNAME})
  name: ROLESNAME;

  @OneToMany(() => RoleFeature, (role_feature) => role_feature.role)
  features: RoleFeature[];

  @OneToMany(() => User, (user) => user.role)
  user: User[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
