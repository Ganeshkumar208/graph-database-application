/* eslint-disable no-console */
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import neo4j from 'neo4j-driver';
import {
  SKILLS,
  PROJECTS,
  PROJECT_SKILLS,
  PEOPLE,
  PERSON_SKILLS,
  PERSON_PROJECTS,
} from './data';

const colors = ['#D4A64A', '#8AA1B1', '#C97B63', '#7C9885', '#B08BBB', '#D9B26F'];

async function main() {
  const uri = process.env.NEO4J_URI;
  const username = process.env.NEO4J_USERNAME;
  const password = process.env.NEO4J_PASSWORD;

  if (!uri || !username || !password) {
    console.error(
      'Missing NEO4J_URI / NEO4J_USERNAME / NEO4J_PASSWORD. Copy .env.example to .env and fill in your CognoDB credentials first.',
    );
    process.exit(1);
  }

  const driver = neo4j.driver(uri, neo4j.auth.basic(username, password));
  await driver.verifyConnectivity();
  console.log(`Connected to ${uri}`);

  const session = driver.session();
  try {
    console.log('Clearing existing graph...');
    await session.executeWrite((tx) => tx.run('MATCH (n) DETACH DELETE n'));

    console.log('Creating uniqueness constraints...');
    for (const label of ['Person', 'Skill', 'Project']) {
      await session.executeWrite((tx) =>
        tx.run(
          `CREATE CONSTRAINT IF NOT EXISTS FOR (n:${label}) REQUIRE n.id IS UNIQUE`,
        ),
      );
    }

    console.log(`Loading ${SKILLS.length} skills...`);
    await session.executeWrite((tx) =>
      tx.run(
        `UNWIND $rows AS row
         CREATE (s:Skill {id: row.id, name: row.name, category: row.category})`,
        { rows: SKILLS },
      ),
    );

    console.log(`Loading ${PROJECTS.length} projects...`);
    await session.executeWrite((tx) =>
      tx.run(
        `UNWIND $rows AS row
         CREATE (p:Project {
           id: row.id, name: row.name, domain: row.domain, status: row.status,
           description: row.description, startDate: row.startDate, endDate: row.endDate
         })`,
        { rows: PROJECTS },
      ),
    );

    console.log(`Loading ${PEOPLE.length} people...`);
    const peopleRows = PEOPLE.map((p, i) => ({ ...p, avatarColor: colors[i % colors.length] }));
    await session.executeWrite((tx) =>
      tx.run(
        `UNWIND $rows AS row
         CREATE (p:Person {
           id: row.id, name: row.name, title: row.title, seniority: row.seniority,
           bio: row.bio, avatarColor: row.avatarColor
         })`,
        { rows: peopleRows },
      ),
    );

    console.log('Linking people to managers (REPORTS_TO)...');
    await session.executeWrite((tx) =>
      tx.run(
        `UNWIND $rows AS row
         MATCH (p:Person {id: row.id}), (m:Person {id: row.reportsTo})
         CREATE (p)-[:REPORTS_TO]->(m)`,
        { rows: PEOPLE.filter((p) => p.reportsTo) },
      ),
    );

    console.log(`Linking ${PERSON_SKILLS.length} HAS_SKILL relationships...`);
    await session.executeWrite((tx) =>
      tx.run(
        `UNWIND $rows AS row
         MATCH (p:Person {id: row[0]}), (s:Skill {id: row[1]})
         CREATE (p)-[:HAS_SKILL {level: row[2], years: row[3]}]->(s)`,
        { rows: PERSON_SKILLS },
      ),
    );

    console.log(`Linking ${PROJECT_SKILLS.length} REQUIRES_SKILL relationships...`);
    await session.executeWrite((tx) =>
      tx.run(
        `UNWIND $rows AS row
         MATCH (proj:Project {id: row.project}), (s:Skill {id: row.skill})
         CREATE (proj)-[:REQUIRES_SKILL {minLevel: row.minLevel}]->(s)`,
        { rows: PROJECT_SKILLS },
      ),
    );

    console.log(`Linking ${PERSON_PROJECTS.length} WORKED_ON relationships...`);
    await session.executeWrite((tx) =>
      tx.run(
        `UNWIND $rows AS row
         MATCH (p:Person {id: row[0]}), (proj:Project {id: row[1]})
         CREATE (p)-[:WORKED_ON {role: row[2]}]->(proj)`,
        { rows: PERSON_PROJECTS },
      ),
    );

    console.log('Seed complete.');
  } finally {
    await session.close();
    await driver.close();
  }
}

main().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
