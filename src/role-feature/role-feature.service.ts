import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleFeature } from './entities/role-feature.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/role/entities/role.entity';
import { Feature } from 'src/feature/entities/feature.entity';
import _ from 'lodash';

@Injectable()
export class RoleFeatureService {


    constructor(
        @InjectRepository(RoleFeature) private roleFeatureRepository: Repository<RoleFeature>
    ) { }

    async create(role: Role, features: Feature[]) {
        const roleFeatures = [];
        await this.roleFeatureRepository.manager.transaction(
            async (transcationEntityManager) => {
            features.forEach(async (feature) => {
                roleFeatures.push(
                this.roleFeatureRepository.create({role, feature})
                );
            });
            await transcationEntityManager.save(roleFeatures);
            }
        );
        return roleFeatures;
    }

    async update(role: Role, features: Feature[]) {
        const roleFeaturesList = await this.roleFeatureRepository.find({
          relations: {
            feature: true
          },
          where: {
            role: {
              id: role.id
            }
          }
        });
        const featuresList = _.map(roleFeaturesList, 'feature');
        const newFeaturesToAddList = _.differenceWith(
          features,
          featuresList,
          _.isEqual
        );
        const featuresToDeleteList = _.differenceWith(
          featuresList,
          features,
          _.isEqual
        );
        const roleToFeatures = [];
    
        try {
          await this.roleFeatureRepository.manager.transaction(
            async (transactionalEntityManager) => {
              if (newFeaturesToAddList.length > 0) {
                newFeaturesToAddList.forEach(async (feature) => {
                  roleToFeatures.push(
                    this.roleFeatureRepository.create({role, feature})
                  )
                });
                await this.roleFeatureRepository.save(roleToFeatures);
              }
              if (featuresToDeleteList.length > 0) {
                featuresToDeleteList.forEach(async (feature) => {
                  this.roleFeatureRepository.softDelete({
                    role: {id: role.id},
                    feature: feature.id
                  });
                });
              }
            }
          )
        } catch (error) {
          throw new BadRequestException({
            is_success: false,
            message: 'Role not updated',
            error
          })
        } finally {
          const data = await this.roleFeatureRepository.find({
            relations: {
              feature: true
            },
            where: {
              role: {
                id: role.id
              },
              deleted_at: null
            }
          });
          const filteredFeatureList = _.map(data, 'feature');
          return filteredFeatureList;
        }
      }
}
