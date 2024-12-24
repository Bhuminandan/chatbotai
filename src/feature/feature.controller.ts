import { Body, Controller, Get, Post } from '@nestjs/common';
import { AllowedAction } from 'src/auth/decorator/action.decorator';
import { MODULE_NAME } from 'src/utils';
import { Feature } from './entities/feature.entity';
import { FeatureService } from './feature.service';

@AllowedAction(MODULE_NAME.GUEST)
@Controller('feature')
export class FeatureController {
  constructor(private featureService: FeatureService) {}

  @Post()
  async create(@Body() body: Partial<Feature>) {
    return this.featureService.create(body);
  }

  @Get()
  async list() {
    try {
      const features = await this.featureService.listFeatures();
      return {
        is_success: true,
        message: 'Successfully fetched',
        data: features,
      };
    } catch (error) {
      return {
        is_success: false,
        message: 'Unsuccessfull to fetch',
        error,
      };
    }
  }
}
