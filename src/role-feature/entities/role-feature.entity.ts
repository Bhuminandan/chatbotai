import { Feature } from 'src/feature/entities/feature.entity';
import { Role } from 'src/role/entities/role.entity';
import {
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'role_features',
})
export class RoleFeature {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Role, (role) => role)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => Feature, (feature) => feature)
  @JoinColumn({ name: 'feature_id' })
  feature: Feature;

  @DeleteDateColumn()
  deleted_at: Date;
}
