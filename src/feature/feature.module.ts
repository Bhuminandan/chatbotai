import { Module } from '@nestjs/common';
import { FeatureService } from './feature.service';
import { FeatureController } from './feature.controller';
import { Feature } from './entities/feature.entity';

@Module({
  imports: [Feature],
  controllers: [FeatureController],
  providers: [FeatureService],
})
export class FeatureModule {}
