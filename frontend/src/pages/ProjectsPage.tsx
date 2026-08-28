import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, ProjectSummary } from '../api/client';
import { LoadingRows, ErrorState, EmptyState } from '../components/States';

const STATUS_COLOR: Record<string, string> = {
  active: 'var(--sage)',
  planning: 'var(--teal)',
  completed: 'var(--parchment-dim)',
};

export function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  function load() {
    setProjects(null);
    setError(null);
    api.projects.list().then(setProjects).catch((e) => setError(e.message));
  }
  useEffect(load, []);

  return (
    <div>
      <h2>Projects</h2>
      {error && <ErrorState message={error} onRetry={load} />}
      {!error && !projects && <LoadingRows count={5} height={90} />}
      {projects && projects.length === 0 && <EmptyState title="No projects yet." />}
      {projects && projects.length > 0 && (
        <div style={{ display: 'grid', gap: '0.9rem' }}>
          {projects.map((p, i) => (
            <Link key={p.project.id} to={`/projects/${p.project.id}`} className="card fade-item" style={{ ['--i' as any]: i, textDecoration: 'none', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <div style={{ color: 'var(--parchment)', fontWeight: 600 }}>{p.project.name}</div>
                <div className="eyebrow">{p.project.domain}</div>
                <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  {p.requiredSkills.map((s) => (
                    <span key={s} className="pill">{s}</span>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.85rem' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: STATUS_COLOR[p.project.status] ?? 'var(--parchment-dim)' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
                  {p.project.status}
                </span>
                <div style={{ color: 'var(--parchment-dim)' }}>{p.teamSize} on team</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
