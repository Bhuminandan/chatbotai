import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ALLOWEDACTION, MODULE_NAME } from 'src/utils';

export class CreateFeature {
  @IsString()
  @IsNotEmpty()
  @IsEnum(MODULE_NAME)
  module_name: MODULE_NAME;

  @IsString()
  @IsNotEmpty()
  @IsEnum(ALLOWEDACTION)
  action: ALLOWEDACTION;
}
