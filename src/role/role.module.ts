import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { RoleFeatureModule } from 'src/role-feature/role-feature.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { FeatureModule } from 'src/feature/feature.module';

@Module({
  imports: [ 
  TypeOrmModule.forFeature([Role]),
  FeatureModule,
  RoleFeatureModule,
],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
