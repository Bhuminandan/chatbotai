import { SetMetadata, Type } from '@nestjs/common';
import { ALLOWEDACTION, MODULE_NAME } from 'src/utils';

export const MODULENAME = 'module';
export const ALLOWACTION = 'allowed_action';
export const PERMISSION = 'permission';
export const ISPUBLIC = 'is_public';

export const AllowedAction = (
  module: MODULE_NAME,
  ...allowedActions: ALLOWEDACTION[]
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
        [MODULENAME]: module,
        [ALLOWACTION]: allowedActions,
      })(target, key, descriptor);
    } else {
      SetMetadata(PERMISSION, {
        [MODULENAME]: module,
        [ALLOWACTION]: allowedActions,
      })(target as any);
    }
  };
};
