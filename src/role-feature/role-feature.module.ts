import { Module } from '@nestjs/common';
import { RoleFeatureService } from './role-feature.service';
import { RoleFeatureController } from './role-feature.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleFeature } from './entities/role-feature.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoleFeature])],
  controllers: [RoleFeatureController],
  providers: [RoleFeatureService],
  exports: [RoleFeatureService],
})
export class RoleFeatureModule {}
