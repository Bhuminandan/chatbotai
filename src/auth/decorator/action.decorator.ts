import { SetMetadata, Type } from '@nestjs/common';
import { ROLENAMES, MODULE_TYPE } from 'src/utils';

export const MODULETYPE = 'module_type';
export const ROLES = 'roles';
export const PERMISSION = 'permission';
export const ISPUBLIC = 'is_public';

export const AllowedRoles = (
  module_type: MODULE_TYPE,
  ...roles: ROLENAMES[]
): ClassDecorator & MethodDecorator => {
  return (
    target: object | Type<any>,
    key?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>,
  ) => {
    if (key) {
      const originalMethod = descriptor.value;
      descriptor.value = function (...args: any[]) {
        return originalMethod.apply(this, args);
      };
      SetMetadata(PERMISSION, {
        [MODULETYPE]: module_type,
        [ROLES]: roles,
      })(target, key, descriptor);
    } else {
      SetMetadata(PERMISSION, {
        [MODULETYPE]: module_type,
        [ROLES]: roles,
      })(target as any);
    }
  };
};
