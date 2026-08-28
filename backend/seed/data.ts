// Realistic seed data for the Skill Graph app: a mid-sized software
// consultancy's people, skills and project history.

export const SKILLS = [
  { id: 'sk-react', name: 'React', category: 'Frontend' },
  { id: 'sk-vue', name: 'Vue.js', category: 'Frontend' },
  { id: 'sk-css', name: 'Advanced CSS', category: 'Frontend' },
  { id: 'sk-nestjs', name: 'NestJS', category: 'Backend' },
  { id: 'sk-node', name: 'Node.js', category: 'Backend' },
  { id: 'sk-django', name: 'Django', category: 'Backend' },
  { id: 'sk-go', name: 'Go', category: 'Backend' },
  { id: 'sk-postgres', name: 'PostgreSQL', category: 'Data' },
  { id: 'sk-mysql', name: 'MySQL', category: 'Data' },
  { id: 'sk-neo4j', name: 'Graph Databases', category: 'Data' },
  { id: 'sk-spark', name: 'Apache Spark', category: 'Data' },
  { id: 'sk-ml', name: 'Machine Learning', category: 'AI/ML' },
  { id: 'sk-llm', name: 'LLM Integration', category: 'AI/ML' },
  { id: 'sk-aws', name: 'AWS', category: 'DevOps' },
  { id: 'sk-k8s', name: 'Kubernetes', category: 'DevOps' },
  { id: 'sk-terraform', name: 'Terraform', category: 'DevOps' },
  { id: 'sk-ios', name: 'iOS (Swift)', category: 'Mobile' },
  { id: 'sk-android', name: 'Android (Kotlin)', category: 'Mobile' },
  { id: 'sk-figma', name: 'Product Design (Figma)', category: 'Design' },
  { id: 'sk-uxr', name: 'UX Research', category: 'Design' },
  { id: 'sk-pm', name: 'Technical Program Management', category: 'Delivery' },
];

export const PROJECTS = [
  { id: 'pr-fleet', name: 'FleetPulse', domain: 'Logistics', status: 'active', description: 'Real-time fleet tracking and maintenance-prediction platform for a regional trucking company.', startDate: '2024-02-01', endDate: null },
  { id: 'pr-civicportal', name: 'CivicPortal', domain: 'Government', status: 'active', description: 'Citizen-facing portal for permit applications and status tracking for a state agency.', startDate: '2023-09-01', endDate: null },
  { id: 'pr-ledgerly', name: 'Ledgerly', domain: 'Fintech', status: 'completed', description: 'Small-business invoicing and cash-flow forecasting SaaS.', startDate: '2022-05-01', endDate: '2023-08-01' },
  { id: 'pr-healthsync', name: 'HealthSync', domain: 'Healthcare', status: 'active', description: 'Appointment scheduling and records-sync tool for multi-clinic practices.', startDate: '2024-06-01', endDate: null },
  { id: 'pr-shelfwise', name: 'Shelfwise', domain: 'Retail', status: 'completed', description: 'Inventory-forecasting dashboard for mid-size grocery chains.', startDate: '2022-01-01', endDate: '2022-11-01' },
  { id: 'pr-eduquest', name: 'EduQuest', domain: 'Education', status: 'active', description: 'Adaptive learning-path app for secondary school students.', startDate: '2023-01-01', endDate: null },
  { id: 'pr-triage-ai', name: 'TriageAI', domain: 'Healthcare', status: 'planning', description: 'LLM-assisted symptom triage support tool for nurse call centers.', startDate: '2025-01-01', endDate: null },
  { id: 'pr-permitgraph', name: 'PermitGraph', domain: 'Government', status: 'planning', description: 'Graph-based dependency checker for multi-agency construction permits.', startDate: '2025-02-01', endDate: null },
  { id: 'pr-routewise', name: 'RouteWise', domain: 'Logistics', status: 'completed', description: 'Last-mile delivery route optimizer.', startDate: '2021-06-01', endDate: '2022-04-01' },
  { id: 'pr-carehub', name: 'CareHub Mobile', domain: 'Healthcare', status: 'active', description: 'Companion mobile app for home-care patients and family caregivers.', startDate: '2024-03-01', endDate: null },
];

export const PROJECT_SKILLS: { project: string; skill: string; minLevel: number }[] = [
  { project: 'pr-fleet', skill: 'sk-react', minLevel: 3 },
  { project: 'pr-fleet', skill: 'sk-nestjs', minLevel: 3 },
  { project: 'pr-fleet', skill: 'sk-postgres', minLevel: 2 },
  { project: 'pr-fleet', skill: 'sk-aws', minLevel: 2 },

  { project: 'pr-civicportal', skill: 'sk-react', minLevel: 3 },
  { project: 'pr-civicportal', skill: 'sk-nestjs', minLevel: 3 },
  { project: 'pr-civicportal', skill: 'sk-mysql', minLevel: 2 },
  { project: 'pr-civicportal', skill: 'sk-pm', minLevel: 3 },

  { project: 'pr-ledgerly', skill: 'sk-vue', minLevel: 3 },
  { project: 'pr-ledgerly', skill: 'sk-django', minLevel: 3 },
  { project: 'pr-ledgerly', skill: 'sk-postgres', minLevel: 3 },

  { project: 'pr-healthsync', skill: 'sk-react', minLevel: 2 },
  { project: 'pr-healthsync', skill: 'sk-node', minLevel: 3 },
  { project: 'pr-healthsync', skill: 'sk-postgres', minLevel: 2 },
  { project: 'pr-healthsync', skill: 'sk-uxr', minLevel: 2 },

  { project: 'pr-shelfwise', skill: 'sk-vue', minLevel: 2 },
  { project: 'pr-shelfwise', skill: 'sk-spark', minLevel: 3 },
  { project: 'pr-shelfwise', skill: 'sk-ml', minLevel: 2 },

  { project: 'pr-eduquest', skill: 'sk-react', minLevel: 3 },
  { project: 'pr-eduquest', skill: 'sk-ml', minLevel: 2 },
  { project: 'pr-eduquest', skill: 'sk-figma', minLevel: 3 },

  { project: 'pr-triage-ai', skill: 'sk-llm', minLevel: 4 },
  { project: 'pr-triage-ai', skill: 'sk-node', minLevel: 2 },
  { project: 'pr-triage-ai', skill: 'sk-uxr', minLevel: 3 },

  { project: 'pr-permitgraph', skill: 'sk-neo4j', minLevel: 4 },
  { project: 'pr-permitgraph', skill: 'sk-nestjs', minLevel: 3 },
  { project: 'pr-permitgraph', skill: 'sk-react', minLevel: 2 },

  { project: 'pr-routewise', skill: 'sk-go', minLevel: 3 },
  { project: 'pr-routewise', skill: 'sk-k8s', minLevel: 2 },
  { project: 'pr-routewise', skill: 'sk-ml', minLevel: 3 },

  { project: 'pr-carehub', skill: 'sk-ios', minLevel: 3 },
  { project: 'pr-carehub', skill: 'sk-android', minLevel: 3 },
  { project: 'pr-carehub', skill: 'sk-figma', minLevel: 2 },
];

export const PEOPLE = [
  { id: 'p-asha', name: 'Asha Rao', title: 'Staff Engineer', seniority: 'Staff', bio: 'Backend and data-platform generalist; enjoys unglamorous migrations.', reportsTo: null },
  { id: 'p-marcus', name: 'Marcus Webb', title: 'Engineering Manager', seniority: 'Manager', bio: 'Leads the Government & Public Sector pod.', reportsTo: null },
  { id: 'p-lina', name: 'Lina Petrova', title: 'Senior Frontend Engineer', seniority: 'Senior', bio: 'React specialist, cares a lot about accessibility.', reportsTo: 'p-marcus' },
  { id: 'p-devon', name: 'Devon Clarke', title: 'Backend Engineer', seniority: 'Mid', bio: 'NestJS and PostgreSQL, formerly a DBA.', reportsTo: 'p-marcus' },
  { id: 'p-priya', name: 'Priya Nair', title: 'Senior Full-Stack Engineer', seniority: 'Senior', bio: 'Works across the stack, currently deep in graph databases.', reportsTo: 'p-asha' },
  { id: 'p-tomasz', name: 'Tomasz Wojcik', title: 'DevOps Engineer', seniority: 'Senior', bio: 'Keeps the clusters awake at 3am so nobody else has to.', reportsTo: 'p-asha' },
  { id: 'p-fatima', name: 'Fatima Al-Sayed', title: 'Data Scientist', seniority: 'Senior', bio: 'Forecasting and ML pipelines, ex-retail analytics.', reportsTo: 'p-asha' },
  { id: 'p-kenji', name: 'Kenji Watanabe', title: 'Mobile Engineer', seniority: 'Mid', bio: 'iOS and Android, obsessive about app-launch time.', reportsTo: 'p-marcus' },
  { id: 'p-sofia', name: 'Sofia Almeida', title: 'Product Designer', seniority: 'Senior', bio: 'Figma systems and UX research for healthcare products.', reportsTo: 'p-marcus' },
  { id: 'p-arjun', name: 'Arjun Mehta', title: 'Backend Engineer', seniority: 'Mid', bio: 'Django and Vue, likes tidy invoicing systems more than is healthy.', reportsTo: 'p-marcus' },
  { id: 'p-hannah', name: 'Hannah Kim', title: 'Frontend Engineer', seniority: 'Junior', bio: 'Recently picked up React professionally after a bootcamp.', reportsTo: 'p-lina' },
  { id: 'p-oliver', name: 'Oliver Bennett', title: 'ML Engineer', seniority: 'Senior', bio: 'LLM integration and applied ML for clinical tools.', reportsTo: 'p-asha' },
  { id: 'p-grace', name: 'Grace Mwangi', title: 'Technical Program Manager', seniority: 'Senior', bio: 'Runs delivery for the Government pod.', reportsTo: 'p-marcus' },
  { id: 'p-noah', name: 'Noah Fischer', title: 'Backend Engineer', seniority: 'Mid', bio: 'Go and Kubernetes, came from a logistics-tech background.', reportsTo: 'p-asha' },
  { id: 'p-ines', name: 'Ines Duarte', title: 'Senior Backend Engineer', seniority: 'Senior', bio: 'NestJS and graph modeling; mentors junior backend hires.', reportsTo: 'p-asha' },
  { id: 'p-samuel', name: 'Samuel Okafor', title: 'Frontend Engineer', seniority: 'Mid', bio: 'Vue and CSS systems, previously at a design agency.', reportsTo: 'p-lina' },
];

// [personId, skillId, level(1-5), years]
export const PERSON_SKILLS: [string, string, number, number][] = [
  ['p-asha', 'sk-node', 5, 9], ['p-asha', 'sk-postgres', 5, 8], ['p-asha', 'sk-neo4j', 3, 2], ['p-asha', 'sk-aws', 4, 6],
  ['p-marcus', 'sk-pm', 4, 7], ['p-marcus', 'sk-nestjs', 2, 3],
  ['p-lina', 'sk-react', 5, 7], ['p-lina', 'sk-css', 5, 8], ['p-lina', 'sk-figma', 2, 3],
  ['p-devon', 'sk-nestjs', 4, 4], ['p-devon', 'sk-postgres', 5, 6], ['p-devon', 'sk-mysql', 4, 5],
  ['p-priya', 'sk-neo4j', 4, 3], ['p-priya', 'sk-nestjs', 4, 4], ['p-priya', 'sk-react', 3, 4], ['p-priya', 'sk-mysql', 3, 5],
  ['p-tomasz', 'sk-aws', 5, 7], ['p-tomasz', 'sk-k8s', 5, 6], ['p-tomasz', 'sk-terraform', 4, 5],
  ['p-fatima', 'sk-ml', 5, 6], ['p-fatima', 'sk-spark', 4, 5], ['p-fatima', 'sk-postgres', 3, 4],
  ['p-kenji', 'sk-ios', 4, 5], ['p-kenji', 'sk-android', 4, 5],
  ['p-sofia', 'sk-figma', 5, 8], ['p-sofia', 'sk-uxr', 5, 7],
  ['p-arjun', 'sk-django', 4, 5], ['p-arjun', 'sk-vue', 3, 4], ['p-arjun', 'sk-postgres', 3, 4],
  ['p-hannah', 'sk-react', 2, 1], ['p-hannah', 'sk-css', 2, 1],
  ['p-oliver', 'sk-llm', 5, 2], ['p-oliver', 'sk-ml', 4, 4], ['p-oliver', 'sk-node', 3, 4],
  ['p-grace', 'sk-pm', 5, 8],
  ['p-noah', 'sk-go', 4, 4], ['p-noah', 'sk-k8s', 3, 3], ['p-noah', 'sk-ml', 2, 2],
  ['p-ines', 'sk-nestjs', 5, 6], ['p-ines', 'sk-neo4j', 4, 3], ['p-ines', 'sk-node', 5, 7],
  ['p-samuel', 'sk-vue', 4, 4], ['p-samuel', 'sk-css', 4, 5],
];

// [personId, projectId, role]
export const PERSON_PROJECTS: [string, string, string][] = [
  ['p-devon', 'pr-fleet', 'Backend Engineer'], ['p-lina', 'pr-fleet', 'Frontend Lead'], ['p-tomasz', 'pr-fleet', 'DevOps'],
  ['p-marcus', 'pr-civicportal', 'Engineering Manager'], ['p-grace', 'pr-civicportal', 'Program Manager'],
  ['p-priya', 'pr-civicportal', 'Full-Stack Engineer'], ['p-samuel', 'pr-civicportal', 'Frontend Engineer'],
  ['p-arjun', 'pr-ledgerly', 'Backend Engineer'], ['p-samuel', 'pr-ledgerly', 'Frontend Engineer'],
  ['p-sofia', 'pr-healthsync', 'Product Designer'], ['p-devon', 'pr-healthsync', 'Backend Engineer'], ['p-hannah', 'pr-healthsync', 'Frontend Engineer'],
  ['p-fatima', 'pr-shelfwise', 'Data Scientist'], ['p-samuel', 'pr-shelfwise', 'Frontend Engineer'],
  ['p-lina', 'pr-eduquest', 'Frontend Lead'], ['p-hannah', 'pr-eduquest', 'Frontend Engineer'], ['p-fatima', 'pr-eduquest', 'Data Scientist'], ['p-sofia', 'pr-eduquest', 'Product Designer'],
  ['p-oliver', 'pr-triage-ai', 'ML Engineer'], ['p-sofia', 'pr-triage-ai', 'UX Researcher'],
  ['p-ines', 'pr-permitgraph', 'Backend Lead'], ['p-priya', 'pr-permitgraph', 'Full-Stack Engineer'],
  ['p-noah', 'pr-routewise', 'Backend Engineer'], ['p-tomasz', 'pr-routewise', 'DevOps'], ['p-fatima', 'pr-routewise', 'Data Scientist'],
  ['p-kenji', 'pr-carehub', 'Mobile Engineer'], ['p-sofia', 'pr-carehub', 'Product Designer'],
];
