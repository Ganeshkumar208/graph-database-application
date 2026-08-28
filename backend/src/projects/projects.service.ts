import { Injectable, NotFoundException } from '@nestjs/common';
import { Neo4jService } from '../neo4j/neo4j.service';

@Injectable()
export class ProjectsService {
  constructor(private readonly neo4j: Neo4jService) {}

  async list() {
    return this.neo4j.read(
      `
      MATCH (proj:Project)
      OPTIONAL MATCH (proj)-[:REQUIRES_SKILL]->(s:Skill)
      OPTIONAL MATCH (p:Person)-[:WORKED_ON]->(proj)
      RETURN proj { .id, .name, .domain, .status } AS project,
             collect(DISTINCT s.name) AS requiredSkills,
             count(DISTINCT p) AS teamSize
      ORDER BY proj.status, proj.name
      `,
    );
  }

  async getDetail(id: string) {
    const rows = await this.neo4j.read(
      `
      MATCH (proj:Project {id: $id})
      OPTIONAL MATCH (proj)-[req:REQUIRES_SKILL]->(s:Skill)
      WITH proj, collect(DISTINCT { id: s.id, name: s.name, minLevel: req.minLevel }) AS requiredSkills
      OPTIONAL MATCH (p:Person)-[w:WORKED_ON]->(proj)
      RETURN proj { .id, .name, .description, .domain, .status, .startDate, .endDate } AS project,
             requiredSkills,
             collect(DISTINCT { id: p.id, name: p.name, title: p.title, role: w.role, avatarColor: p.avatarColor }) AS team
      `,
      { id },
    );
    if (rows.length === 0) throw new NotFoundException(`No project with id ${id}`);
    const row = rows[0];
    return {
      ...row.project,
      requiredSkills: row.requiredSkills.filter((s: any) => s.id),
      team: row.team.filter((t: any) => t.id),
    };
  }

  /**
   * Suggest a team for a project's required skills.
   *
   * For each required skill, find people who meet the minimum level, then
   * score each candidate by how many *other* qualified candidates for this
   * same project they've already collaborated with on a past project
   * (shared WORKED_ON edges). This rewards assembling a team that already
   * has working chemistry, not just individually-qualified strangers.
   *
   * This is the kind of query a relational schema makes painful: it needs
   * a multi-hop self-join across the project-membership table just to
   * compute "candidates who already know each other", then another join
   * back to the skill requirement table to filter by relevance -- all of
   * which falls out naturally as a single graph pattern here.
   */
  async suggestTeam(id: string) {
    const query = `
MATCH (proj:Project {id: $id})-[req:REQUIRES_SKILL]->(skill:Skill)
MATCH (candidate:Person)-[hs:HAS_SKILL]->(skill)
WHERE hs.level >= req.minLevel
OPTIONAL MATCH (candidate)-[:WORKED_ON]->(:Project)<-[:WORKED_ON]-(other:Person)
              -[:HAS_SKILL]->(:Skill)<-[:REQUIRES_SKILL]-(proj)
WHERE other <> candidate
WITH skill, candidate, hs, count(DISTINCT other) AS networkStrength
RETURN skill { .id, .name } AS skill,
       candidate { .id, .name, .title, .avatarColor } AS candidate,
       hs.level AS level, networkStrength
ORDER BY skill.name, level DESC, networkStrength DESC`;
    const results = await this.neo4j.read(query, { id });

    const bySkill = new Map<string, any>();
    for (const r of results) {
      if (!bySkill.has(r.skill.id)) {
        bySkill.set(r.skill.id, { skill: r.skill, candidates: [] });
      }
      bySkill.get(r.skill.id).candidates.push({
        ...r.candidate,
        level: r.level,
        networkStrength: r.networkStrength,
      });
    }
    return { query, suggestions: Array.from(bySkill.values()) };
  }
}
