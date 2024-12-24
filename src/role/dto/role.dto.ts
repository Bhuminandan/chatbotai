import {ApiProperty} from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber
} from 'class-validator';
import {ROLESNAME} from 'src/utils';

export class CreateRoleDto {

  @IsEnum(ROLESNAME)
  @IsNotEmpty()
  @ApiProperty()
  name: ROLESNAME;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({allowNaN: false}, {each: true})
  @ApiProperty({example: [1, 2]})
  features: number[];
}
