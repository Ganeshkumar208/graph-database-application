import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import { LoadingRows, ErrorState, EmptyState } from '../components/States';

export function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get('q') ?? '';
  const [results, setResults] = useState<{ people: any[]; skills: any[]; projects: any[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setResults(null);
    setError(null);
    if (!q) return;
    api.search(q).then(setResults).catch((e) => setError(e.message));
  }, [q]);

  const total = results ? results.people.length + results.skills.length + results.projects.length : 0;

  return (
    <div>
      <h2>Results for &ldquo;{q}&rdquo;</h2>
      {error && <ErrorState message={error} />}
      {!error && !results && <LoadingRows count={4} height={50} />}
      {results && total === 0 && <EmptyState title="Nothing matched that search." hint="Try a shorter or different term." />}
      {results && total > 0 && (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {results.people.length > 0 && (
            <ResultGroup title="People" items={results.people} toPath={(i) => `/people/${i.id}`} sub={(i) => i.title} />
          )}
          {results.skills.length > 0 && (
            <ResultGroup title="Skills" items={results.skills} toPath={(i) => `/skills/${i.id}`} sub={(i) => i.category} />
          )}
          {results.projects.length > 0 && (
            <ResultGroup title="Projects" items={results.projects} toPath={(i) => `/projects/${i.id}`} sub={(i) => i.domain} />
          )}
        </div>
      )}
    </div>
  );
}

function ResultGroup({ title, items, toPath, sub }: { title: string; items: any[]; toPath: (i: any) => string; sub: (i: any) => string }) {
  return (
    <div>
      <div className="eyebrow">{title}</div>
      <div style={{ display: 'grid', gap: '0.5rem', marginTop: '0.5rem' }}>
        {items.map((i) => (
          <Link key={i.id} to={toPath(i)} className="card" style={{ textDecoration: 'none', display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.9rem' }}>
            <span style={{ color: 'var(--parchment)' }}>{i.name}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--parchment-dim)' }}>{sub(i)}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
