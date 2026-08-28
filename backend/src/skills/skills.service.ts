import { Injectable, NotFoundException } from '@nestjs/common';
import { Neo4jService } from '../neo4j/neo4j.service';

@Injectable()
export class SkillsService {
  constructor(private readonly neo4j: Neo4jService) {}

  async list() {
    return this.neo4j.read(
      `
      MATCH (s:Skill)
      OPTIONAL MATCH (p:Person)-[:HAS_SKILL]->(s)
      RETURN s { .id, .name, .category } AS skill, count(DISTINCT p) AS expertCount
      ORDER BY s.category, s.name
      `,
    );
  }

  async getDetail(id: string) {
    const rows = await this.neo4j.read(
      `
      MATCH (s:Skill {id: $id})
      OPTIONAL MATCH (p:Person)-[hs:HAS_SKILL]->(s)
      WITH s, p, hs ORDER BY hs.level DESC, hs.years DESC
      RETURN s { .id, .name, .category } AS skill,
             collect(DISTINCT { id: p.id, name: p.name, title: p.title, level: hs.level, years: hs.years, avatarColor: p.avatarColor }) AS experts
      `,
      { id },
    );
    if (rows.length === 0) throw new NotFoundException(`No skill with id ${id}`);
    return { ...rows[0].skill, experts: rows[0].experts.filter((e: any) => e.id) };
  }

  /**
   * Ego-network for a skill: direct experts (hop 1), plus colleagues of
   * those experts who don't yet hold the skill but have worked alongside
   * someone who does (hop 2) -- candidates for mentorship / upskilling.
   */
  async getNetworkGraph(id: string) {
    // As in PeopleService.findSkillInNetwork: the "doesn't already have this
    // skill" check is an ID-list membership test, not a
    // `NOT (learner)-[:HAS_SKILL]->(s)` pattern-predicate -- CognoDB
    // mis-evaluates that predicate form once the nodes involved were bound
    // earlier in a longer match chain (verified against a live instance).
    const rows = await this.neo4j.read(
      `
      MATCH (s:Skill {id: $id})
      OPTIONAL MATCH (holder:Person)-[:HAS_SKILL]->(s)
      WITH s, collect(DISTINCT holder.id) AS holderIds
      OPTIONAL MATCH (expert:Person)-[hs:HAS_SKILL]->(s)
      OPTIONAL MATCH (expert)-[:WORKED_ON]->(proj:Project)<-[:WORKED_ON]-(learner:Person)
      WHERE learner.id <> expert.id AND NOT learner.id IN holderIds
      RETURN s { .id, .name, .category } AS skill,
             collect(DISTINCT { id: expert.id, name: expert.name, level: hs.level }) AS experts,
             collect(DISTINCT { id: learner.id, name: learner.name, via: expert.id }) AS learners
      `,
      { id },
    );
    if (rows.length === 0) throw new NotFoundException(`No skill with id ${id}`);
    const { skill, experts, learners } = rows[0];

    const nodes = [{ ...skill, type: 'skill', hop: 0 }];
    const links: any[] = [];
    for (const e of experts.filter((x: any) => x.id)) {
      nodes.push({ id: e.id, name: e.name, level: e.level, type: 'person', hop: 1 });
      links.push({ source: skill.id, target: e.id, type: 'HAS_SKILL' });
    }
    const seen = new Set<string>();
    for (const l of learners.filter((x: any) => x.id)) {
      if (!seen.has(l.id)) {
        nodes.push({ id: l.id, name: l.name, type: 'person', hop: 2 });
        seen.add(l.id);
      }
      links.push({ source: l.via, target: l.id, type: 'WORKED_ON' });
    }
    return { nodes, links };
  }
}
