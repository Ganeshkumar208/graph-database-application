import { Controller, Get } from '@nestjs/common';
import { Neo4jService } from '../neo4j/neo4j.service';

@Controller('api/health')
export class HealthController {
  constructor(private readonly neo4j: Neo4jService) {}

  @Get()
  async check() {
    const dbHealthy = await this.neo4j.isHealthy();
    return {
      status: dbHealthy ? 'ok' : 'degraded',
      database: dbHealthy ? 'connected' : 'unreachable',
    };
  }
}
