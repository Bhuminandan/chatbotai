import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Feature } from './entities/feature.entity';

@Injectable()
export class FeatureService {
  constructor(
    @InjectRepository(Feature) private featureRepository: Repository<Feature>,
  ) {}

  async create(_featureParams: Partial<Feature>) {
    try {
      const isFeatureExists = await this.featureRepository.findOne({
        where: {
          module_name: _featureParams.module_name,
          action: _featureParams.action,
        },
      });

      if (isFeatureExists) {
        throw new BadRequestException({
          is_success: false,
          message: 'feature with action already exists',
        });
      }

      const feature = this.featureRepository.create(_featureParams);
      await this.featureRepository.save(feature);

      return {
        is_success: true,
        message: 'Successfully created feature',
      };
    } catch (error) {
      return {
        is_success: false,
        message: 'Unsuccessfull to add feature',
        error,
      };
    }
  }

  async findOne(_options: FindOneOptions<Feature>) {
    const feature = await this.featureRepository.findOne(_options);

    if (!feature) {
      throw new BadRequestException({
        is_success: false,
        message: 'Not Found',
      });
    }

    return feature;
  }

  async find(_options: FindManyOptions<Feature>) {
    return await this.featureRepository.find(_options);
  }

  async listFeatures() {
    return await this.featureRepository.find();
  }
}
