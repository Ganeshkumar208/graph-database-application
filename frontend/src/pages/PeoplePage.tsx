import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, PersonSummary, SkillSummary } from '../api/client';
import { Avatar } from '../components/Bits';
import { LoadingRows, ErrorState, EmptyState } from '../components/States';

export function PeoplePage() {
  const [people, setPeople] = useState<PersonSummary[] | null>(null);
  const [skills, setSkills] = useState<SkillSummary[]>([]);
  const [skillId, setSkillId] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.skills.list().then(setSkills).catch(() => {});
  }, []);

  function load() {
    setPeople(null);
    setError(null);
    api.people
      .list({ skillId: skillId || undefined })
      .then(setPeople)
      .catch((e) => setError(e.message));
  }

  useEffect(load, [skillId]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.25rem' }}>
        <h2>People</h2>
        <select
          value={skillId}
          onChange={(e) => setSkillId(e.target.value)}
          style={{ background: 'var(--surface)', color: 'var(--parchment)', border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)', padding: '0.4rem 0.6rem' }}
        >
          <option value="">All skills</option>
          {skills.map((s) => (
            <option key={s.skill.id} value={s.skill.id}>{s.skill.name}</option>
          ))}
        </select>
      </div>

      {error && <ErrorState message={error} onRetry={load} />}
      {!error && !people && <LoadingRows count={6} height={78} />}
      {people && people.length === 0 && (
        <EmptyState title="No one matches that filter." hint="Try a different skill." />
      )}
      {people && people.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {people.map((p) => (
            <Link key={p.id} to={`/people/${p.id}`} className="card" style={{ display: 'flex', gap: '0.9rem', textDecoration: 'none' }}>
              <Avatar name={p.name} color={p.avatarColor} />
              <div style={{ minWidth: 0 }}>
                <div style={{ color: 'var(--parchment)', fontWeight: 600 }}>{p.name}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--parchment-dim)' }}>{p.title}</div>
                <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  {p.topSkills.slice(0, 3).map((s) => (
                    <span key={s.id} className="pill">{s.name}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
