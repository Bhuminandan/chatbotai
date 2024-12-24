import { RoleFeature } from 'src/role-feature/entities/role-feature.entity';
import { ALLOWEDACTION, MODULE_NAME } from 'src/utils';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'feature',
})
export class Feature {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: MODULE_NAME })
  module_name: MODULE_NAME;

  @Column({ type: 'enum', enum: ALLOWEDACTION })
  action: ALLOWEDACTION;

  @OneToMany(() => RoleFeature, (role_feature) => role_feature.feature)
  role: Feature[];
}
