import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorator/auth.decorator';
import { ModulesService } from './modules.service';

@Auth()
@ApiTags('modules')
@Controller('/api/v1/module')
export class ModulesController {
  constructor(private modulesService: ModulesService) {}
}
