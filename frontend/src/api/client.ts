const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

async function request<T>(path: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`);
  } catch {
    throw new ApiError('Could not reach the API. Is the backend running?', 0);
  }
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      message = body.message || message;
    } catch {
      /* ignore parse errors */
    }
    throw new ApiError(message, res.status);
  }
  return res.json();
}

export interface PersonSummary {
  id: string;
  name: string;
  title: string;
  seniority: string;
  avatarColor: string;
  topSkills: { id: string; name: string; level: number }[];
}

export interface PersonProfile {
  id: string;
  name: string;
  title: string;
  seniority: string;
  bio: string;
  avatarColor: string;
  skills: { id: string; name: string; category: string; level: number; years: number }[];
  projects: { id: string; name: string; role: string; status: string; domain: string }[];
  manager: { id: string; name: string; title: string } | null;
}

export interface GraphNode {
  id: string;
  name: string;
  type: 'person' | 'skill' | 'project';
  hop: number;
  [key: string]: unknown;
}
export interface GraphLink {
  source: string;
  target: string;
  type: string;
}
export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface SkillSummary {
  skill: { id: string; name: string; category: string };
  expertCount: number;
}

export interface SkillDetail {
  id: string;
  name: string;
  category: string;
  experts: { id: string; name: string; title: string; level: number; years: number; avatarColor: string }[];
}

export interface ProjectSummary {
  project: { id: string; name: string; domain: string; status: string };
  requiredSkills: string[];
  teamSize: number;
}

export interface ProjectDetail {
  id: string;
  name: string;
  description: string;
  domain: string;
  status: string;
  startDate: string;
  endDate: string | null;
  requiredSkills: { id: string; name: string; minLevel: number }[];
  team: { id: string; name: string; title: string; role: string; avatarColor: string }[];
}

export interface TeamSuggestion {
  query: string;
  suggestions: {
    skill: { id: string; name: string };
    candidates: { id: string; name: string; title: string; avatarColor: string; level: number; networkStrength: number }[];
  }[];
}

export const api = {
  people: {
    list: (params?: { skillId?: string; q?: string }) => {
      const qs = new URLSearchParams();
      if (params?.skillId) qs.set('skillId', params.skillId);
      if (params?.q) qs.set('q', params.q);
      const suffix = qs.toString() ? `?${qs}` : '';
      return request<PersonSummary[]>(`/api/people${suffix}`);
    },
    get: (id: string) => request<PersonProfile>(`/api/people/${id}`),
    graph: (id: string) => request<GraphData>(`/api/people/${id}/graph`),
    findSkillInNetwork: (id: string, skillId: string) =>
      request<{ query: string; results: any[] }>(`/api/people/${id}/network?skillId=${skillId}`),
    pathToSkill: (id: string, skillId: string) =>
      request<{ query: string; path: { nodes: any[]; relTypes: string[] } }>(
        `/api/people/${id}/path-to-skill/${skillId}`,
      ),
  },
  skills: {
    list: () => request<SkillSummary[]>('/api/skills'),
    get: (id: string) => request<SkillDetail>(`/api/skills/${id}`),
    graph: (id: string) => request<GraphData>(`/api/skills/${id}/graph`),
  },
  projects: {
    list: () => request<ProjectSummary[]>('/api/projects'),
    get: (id: string) => request<ProjectDetail>(`/api/projects/${id}`),
    suggestTeam: (id: string) => request<TeamSuggestion>(`/api/projects/${id}/suggest-team`),
  },
  search: (q: string) =>
    request<{ people: any[]; skills: any[]; projects: any[] }>(`/api/search?q=${encodeURIComponent(q)}`),
  health: () => request<{ status: string; database: string }>('/api/health').catch(() => null),
};
