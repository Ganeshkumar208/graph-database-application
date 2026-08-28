import { Injectable, NotFoundException } from '@nestjs/common';
import { Neo4jService } from '../neo4j/neo4j.service';

@Injectable()
export class PeopleService {
  constructor(private readonly neo4j: Neo4jService) {}

  /** List people, optionally filtered by a skill they hold or a free-text name match. */
  async list(params: { skillId?: string; q?: string }) {
    const { skillId, q } = params;
    // The skill filter is precomputed in its own CALL subquery rather than
    // as an inline `OPTIONAL MATCH (p)-[:HAS_SKILL]->(:Skill {id: $skillId})`
    // pattern-predicate: CognoDB silently ignores a parameterised inline
    // property filter (`{id: $skillId}`) on an OPTIONAL MATCH node, matching
    // every relationship regardless of id (verified against a live
    // instance). A self-contained CALL subquery avoids that shape entirely.
    const rows = await this.neo4j.read(
      `
      CALL {
        WITH $skillId AS skillId
        OPTIONAL MATCH (holder:Person)-[:HAS_SKILL]->(:Skill {id: skillId})
        RETURN collect(DISTINCT holder.id) AS qualifyingIds
      }
      MATCH (p:Person)
      WHERE ($q IS NULL OR toLower(p.name) CONTAINS toLower($q))
        AND ($skillId IS NULL OR p.id IN qualifyingIds)
      OPTIONAL MATCH (p)-[hs:HAS_SKILL]->(s:Skill)
      WITH p, s, hs ORDER BY hs.level DESC
      WITH p, collect({ id: s.id, name: s.name, level: hs.level })[0..4] AS topSkills
      RETURN p { .id, .name, .title, .seniority, .avatarColor } AS person, topSkills
      ORDER BY p.name
      `,
      { skillId: skillId ?? null, q: q ?? null },
    );
    return rows.map((r) => ({ ...r.person, topSkills: r.topSkills }));
  }

  /** Full profile: the person, their skills, project history and manager chain. */
  async getProfile(id: string) {
    const rows = await this.neo4j.read(
      `
      MATCH (p:Person {id: $id})
      OPTIONAL MATCH (p)-[hs:HAS_SKILL]->(s:Skill)
      WITH p, collect(DISTINCT { id: s.id, name: s.name, category: s.category, level: hs.level, years: hs.years }) AS skills
      OPTIONAL MATCH (p)-[w:WORKED_ON]->(proj:Project)
      WITH p, skills, collect(DISTINCT { id: proj.id, name: proj.name, role: w.role, status: proj.status, domain: proj.domain }) AS projects
      OPTIONAL MATCH (p)-[:REPORTS_TO]->(manager:Person)
      RETURN p { .id, .name, .title, .seniority, .bio, .avatarColor } AS person,
             skills, projects,
             manager { .id, .name, .title } AS manager
      `,
      { id },
    );
    if (rows.length === 0) throw new NotFoundException(`No person with id ${id}`);
    const row = rows[0];
    return {
      ...row.person,
      skills: row.skills.filter((s: any) => s.id),
      projects: row.projects.filter((p: any) => p.id),
      manager: row.manager?.id ? row.manager : null,
    };
  }

  /**
   * Ego-network graph for the visual "constellation" view: the person (hop 0),
   * their direct skills and projects (hop 1), and colleagues reached by
   * having worked on the same project (hop 2). A genuine 2+ hop traversal.
   */
  async getNetworkGraph(id: string) {
    const rows = await this.neo4j.read(
      `
      MATCH (p:Person {id: $id})
      OPTIONAL MATCH (p)-[:HAS_SKILL]->(s:Skill)
      OPTIONAL MATCH (p)-[:WORKED_ON]->(proj:Project)
      OPTIONAL MATCH (p)-[:WORKED_ON]->(proj2:Project)<-[:WORKED_ON]-(colleague:Person)
      WHERE colleague.id <> $id
      RETURN p { .id, .name, .title, .avatarColor } AS person,
             collect(DISTINCT { id: s.id, name: s.name, category: s.category }) AS skills,
             collect(DISTINCT { id: proj.id, name: proj.name }) AS projects,
             collect(DISTINCT { id: colleague.id, name: colleague.name, title: colleague.title, via: proj2.id }) AS colleagues
      `,
      { id },
    );
    if (rows.length === 0) throw new NotFoundException(`No person with id ${id}`);
    const { person, skills, projects, colleagues } = rows[0];

    const nodes = [{ ...person, type: 'person', hop: 0 }];
    const links: any[] = [];

    for (const s of skills.filter((x: any) => x.id)) {
      nodes.push({ ...s, type: 'skill', hop: 1 });
      links.push({ source: person.id, target: s.id, type: 'HAS_SKILL' });
    }
    for (const p of projects.filter((x: any) => x.id)) {
      nodes.push({ ...p, type: 'project', hop: 1 });
      links.push({ source: person.id, target: p.id, type: 'WORKED_ON' });
    }
    const seenColleague = new Set<string>();
    for (const c of colleagues.filter((x: any) => x.id)) {
      if (!seenColleague.has(c.id)) {
        nodes.push({ id: c.id, name: c.name, title: c.title, type: 'person', hop: 2 });
        seenColleague.add(c.id);
      }
      if (c.via) links.push({ source: c.via, target: c.id, type: 'WORKED_ON' });
    }
    return { nodes, links };
  }

  /**
   * "Extended network for a skill": people who do NOT directly hold the
   * given skill, but who have a colleague (via a shared past project) who
   * does. This is the multi-hop (2-hop) query the assignment calls for --
   * a relational schema would need a self-join through the project
   * membership table to answer the same question.
   */
  async findSkillInNetwork(id: string, skillId: string) {
    // The exclusion is expressed as an ID-list membership check rather than
    // a `NOT (target)-[:HAS_SKILL]->(skill)` pattern-predicate: CognoDB
    // mis-evaluates that pattern-predicate form when `target`/`skill` were
    // already bound earlier in a longer match chain (confirmed against a
    // live instance -- it returns `true` regardless of actual connectivity),
    // so the boolean check is done as plain value comparison instead.
    const query = `
MATCH (target:Person {id: $id})
OPTIONAL MATCH (target)-[:HAS_SKILL]->(known:Skill)
WITH target, collect(known.id) AS knownSkillIds
MATCH (target)-[:WORKED_ON]->(proj:Project)<-[:WORKED_ON]-(colleague:Person)
      -[hs:HAS_SKILL]->(skill:Skill {id: $skillId})
WHERE NOT skill.id IN knownSkillIds
RETURN DISTINCT colleague { .id, .name, .title, .avatarColor } AS person,
       hs.level AS level, hs.years AS years, proj.name AS viaProject
ORDER BY level DESC, years DESC`;
    const results = await this.neo4j.read(query, { id, skillId });
    return { query, results };
  }

  /**
   * Shortest path between a person and a skill they don't hold, through
   * whatever mix of colleagues and projects connects them. Variable-length
   * shortest-path search like this is native to a graph database and would
   * require iterative recursive CTEs (with no guaranteed termination bound)
   * to approximate in SQL.
   */
  async shortestPathToSkill(id: string, skillId: string) {
    const query = `
MATCH (p:Person {id: $id}), (s:Skill {id: $skillId})
MATCH path = shortestPath((p)-[:WORKED_ON|HAS_SKILL*..8]-(s))
RETURN [n IN nodes(path) | n {.id, .name, labels: labels(n)}] AS nodes,
       [r IN relationships(path) | type(r)] AS relTypes`;
    const rows = await this.neo4j.read(query, { id, skillId });
    return { query, path: rows[0] ?? { nodes: [], relTypes: [] } };
  }
}
