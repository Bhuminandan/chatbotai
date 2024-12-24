import { Controller } from '@nestjs/common';
import { RoleFeatureService } from './role-feature.service';

@Controller('role-feature')
export class RoleFeatureController {
  constructor(private readonly roleFeatureService: RoleFeatureService) {}
}
