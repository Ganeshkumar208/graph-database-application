import { Controller, Get, Param, Query } from '@nestjs/common';
import { PeopleService } from './people.service';

@Controller('api/people')
export class PeopleController {
  constructor(private readonly people: PeopleService) {}

  @Get()
  list(@Query('skillId') skillId?: string, @Query('q') q?: string) {
    return this.people.list({ skillId, q });
  }

  @Get(':id')
  getProfile(@Param('id') id: string) {
    return this.people.getProfile(id);
  }

  @Get(':id/graph')
  getGraph(@Param('id') id: string) {
    return this.people.getNetworkGraph(id);
  }

  @Get(':id/network')
  findSkillInNetwork(@Param('id') id: string, @Query('skillId') skillId: string) {
    return this.people.findSkillInNetwork(id, skillId);
  }

  @Get(':id/path-to-skill/:skillId')
  shortestPath(@Param('id') id: string, @Param('skillId') skillId: string) {
    return this.people.shortestPathToSkill(id, skillId);
  }
}
