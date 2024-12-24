import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleFeature } from './entities/role-feature.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/role/entities/role.entity';
import { Feature } from 'src/feature/entities/feature.entity';

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
}
