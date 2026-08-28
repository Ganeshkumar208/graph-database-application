import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Neo4jModule } from './neo4j/neo4j.module';
import { PeopleModule } from './people/people.module';
import { ProjectsModule } from './projects/projects.module';
import { SkillsModule } from './skills/skills.module';
import { SearchModule } from './search/search.module';
import { HealthController } from './health/health.controller';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    Neo4jModule,
    PeopleModule,
    ProjectsModule,
    SkillsModule,
    SearchModule,
  ],
  controllers: [AppController, HealthController],
})
export class AppModule {}
