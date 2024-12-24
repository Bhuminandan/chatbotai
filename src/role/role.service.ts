import { BadRequestException, Injectable } from '@nestjs/common';
import { Role } from './entities/role.entity';
import { FeatureService } from 'src/feature/feature.service';
import { RoleFeatureService } from 'src/role-feature/role-feature.service';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, In, Repository } from 'typeorm';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role) private roleRepository: Repository<Role>,
        private readonly featureService: FeatureService,
        private readonly roleFeatureService: RoleFeatureService
    ) {}
    
    async findOne(_options: FindOneOptions<Role>) {
        return await this.roleRepository.findOne(_options);
    }

    async create(_roleParams: Partial<Role>, _features: number[]) {
        const isRoleNameUnique = await this.findOne({
          where: { name: _roleParams.name },
        });
    
        if (isRoleNameUnique) {
          throw new BadRequestException({
            is_success: false,
            message: 'Kindly provide a unique role name',
          });
        }
    
        const features = await this.featureService.find({
          where: { id: In(_features) },
        });
    
        if (features.length === 0 || features.length !== _features.length) {
          throw new BadRequestException({
            is_success: false,
            message: 'Kindly provide correct feature permissions',
          });
        }
        const role = this.roleRepository.create(_roleParams);
        await this.roleRepository.save(role);
        await this.roleFeatureService.create(role, features);
      }
}
