import { BadRequestException, Injectable } from '@nestjs/common';
import { Role } from './entities/role.entity';
import { FeatureService } from 'src/feature/feature.service';
import { RoleFeatureService } from 'src/role-feature/role-feature.service';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, In, Repository } from 'typeorm';
import { CurrentUser } from 'src/utils/helpers/interface';
import { ROLESNAME } from 'src/utils';
import _ from 'lodash';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    private readonly featureService: FeatureService,
    private readonly roleFeatureService: RoleFeatureService,
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

  async update(_roleId: number, _params: Partial<Role>, _features: number[]) {
    const role = await this.findOne({ where: { id: _roleId } });
    if (!role) {
      throw new BadRequestException({
        is_success: false,
        message: 'Role does not exits',
      });
    }

    const features = await this.featureService.find({
      where: { id: In(_features) },
    });

    if (features.length === 0) {
      throw new BadRequestException({
        is_success: false,
        message: 'Kindly provide correct feature permissions',
      });
    }

    if (role.name !== _params.name) {
      const isRoleNameUnique = await this.roleRepository.findOne({
        where: { name: _params.name },
      });
      if (isRoleNameUnique) {
        throw new BadRequestException({
          is_success: false,
          message: 'Kindly provide a unique role name',
        });
      }
    }
    await this.roleRepository.update({ id: _roleId }, _params);
    const updatedRole = await this.findOne({ where: { id: _roleId } });
    const updatedFeatures = await this.roleFeatureService.update(
      role,
      features,
    );
    return {
      ..._.omit(updatedRole, ['created_at', 'updated_at', 'deleted_at']),
      features: updatedFeatures,
    };
  }

  async listAllRoles(currentUser: CurrentUser) {
    const searchFilter = this.createRoleSearchFilter(currentUser.role_name);
    const roles = await this.roleRepository.find({
      relations: {
        features: {
          feature: true,
        },
      },
      where: searchFilter,
    });
    const response = roles.map((role) => {
      const features = _.map(role.features, 'feature');
      return {
        ..._.omit(role, ['created_at', 'updated_at', 'deleted_at']),
        features,
      };
    });
    return response;
  }

  async delete(_roleId: number) {
    const role = await this.roleRepository.findOne({
      relations: {
        user: true,
      },
      where: {
        id: _roleId,
        // user: {
        //   status: STATUS.ACTIVE,
        // },
      },
    });
    const { user } = role;
    if (user.length > 0) {
      throw new BadRequestException({
        is_success: false,
        message: 'Cannot delete role. Role is associated with active users',
      });
    }
    await this.roleRepository.softDelete({ id: _roleId });
  }

  createRoleSearchFilter(role: ROLESNAME) {
    let searchFilter = {};
    switch (role) {
      case ROLESNAME.ADMIN:
        break;
      // case ROLESNAME.HO:
      //   searchFilter = {
      //     name: Not(ROLESNAME.ADMIN),
      //   };
      //   break;
      // case ROLESNAME['HO WITHOUT PROMO']:
      //   searchFilter = {
      //     name: In[
      //       (ROLESNAME.DISTRIBUTOR,
      //       ROLESNAME['CHANNEL HEAD'],
      //       ROLESNAME.RSM,
      //       ROLESNAME.ZSM,
      //       ROLESNAME.ASM,
      //       ROLESNAME.CRO)
      //     ],
      //   };
      //   break;
      // case ROLESNAME.DISTRIBUTOR:
      // case ROLESNAME['CHANNEL HEAD']:
      // case ROLESNAME.CRO:
      // case ROLESNAME.RSM:
      // case ROLESNAME.ZSM:
      // case ROLESNAME.ASM:
      //   searchFilter = {
      //     name: ROLESNAME.SALESMAN,
      //   };
      //   break;
    }
    return searchFilter;
  }
}
