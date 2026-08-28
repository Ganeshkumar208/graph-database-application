import { Controller, Get, Param } from '@nestjs/common';
import { SkillsService } from './skills.service';

@Controller('api/skills')
export class SkillsController {
  constructor(private readonly skills: SkillsService) {}

  @Get()
  list() {
    return this.skills.list();
  }

  @Get(':id')
  getDetail(@Param('id') id: string) {
    return this.skills.getDetail(id);
  }

  @Get(':id/graph')
  getGraph(@Param('id') id: string) {
    return this.skills.getNetworkGraph(id);
  }
}
