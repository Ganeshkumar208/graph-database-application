import { Controller, Get, Param } from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Controller('api/projects')
export class ProjectsController {
  constructor(private readonly projects: ProjectsService) {}

  @Get()
  list() {
    return this.projects.list();
  }

  @Get(':id')
  getDetail(@Param('id') id: string) {
    return this.projects.getDetail(id);
  }

  @Get(':id/suggest-team')
  suggestTeam(@Param('id') id: string) {
    return this.projects.suggestTeam(id);
  }
}
