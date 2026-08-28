import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, SkillSummary } from '../api/client';
import { LoadingRows, ErrorState } from '../components/States';

export function SkillsPage() {
  const [skills, setSkills] = useState<SkillSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  function load() {
    setSkills(null);
    setError(null);
    api.skills.list().then(setSkills).catch((e) => setError(e.message));
  }
  useEffect(load, []);

  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!skills) return <LoadingRows count={6} height={40} />;

  const byCategory = new Map<string, SkillSummary[]>();
  for (const s of skills) {
    const list = byCategory.get(s.skill.category) ?? [];
    list.push(s);
    byCategory.set(s.skill.category, list);
  }

  return (
    <div>
      <h2>Skills</h2>
      <div style={{ display: 'grid', gap: '1.75rem' }}>
        {Array.from(byCategory.entries()).map(([category, list], groupIndex) => (
          <div key={category} className="fade-item" style={{ ['--i' as any]: groupIndex }}>
            <div className="eyebrow">{category}</div>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              {list.map((s) => (
                <Link key={s.skill.id} to={`/skills/${s.skill.id}`} className="card" style={{ textDecoration: 'none', padding: '0.6rem 0.9rem', display: 'flex', gap: '0.5rem', alignItems: 'baseline' }}>
                  <span style={{ color: 'var(--parchment)' }}>{s.skill.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--parchment-dim)' }}>{s.expertCount}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
