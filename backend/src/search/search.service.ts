import { Injectable } from '@nestjs/common';
import { Neo4jService } from '../neo4j/neo4j.service';

@Injectable()
export class SearchService {
  constructor(private readonly neo4j: Neo4jService) {}

  async search(q: string) {
    if (!q || q.trim().length === 0) {
      return { people: [], skills: [], projects: [] };
    }
    const rows = await this.neo4j.read(
      `
      CALL {
        MATCH (p:Person) WHERE toLower(p.name) CONTAINS toLower($q)
        RETURN collect(p { .id, .name, .title, kind: 'person' })[0..6] AS people
      }
      CALL {
        MATCH (s:Skill) WHERE toLower(s.name) CONTAINS toLower($q)
        RETURN collect(s { .id, .name, .category, kind: 'skill' })[0..6] AS skills
      }
      CALL {
        MATCH (proj:Project) WHERE toLower(proj.name) CONTAINS toLower($q)
        RETURN collect(proj { .id, .name, .domain, kind: 'project' })[0..6] AS projects
      }
      RETURN people, skills, projects
      `,
      { q },
    );
    return rows[0] ?? { people: [], skills: [], projects: [] };
  }
}
