import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, GraphData, PersonProfile, SkillSummary } from '../api/client';
import { Avatar, SkillLevelBar } from '../components/Bits';
import { NetworkGraph } from '../components/NetworkGraph';
import { CypherPanel } from '../components/CypherPanel';
import { LoadingRows, ErrorState, EmptyState } from '../components/States';

export function PersonDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState<PersonProfile | null>(null);
  const [graph, setGraph] = useState<GraphData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [allSkills, setAllSkills] = useState<SkillSummary[]>([]);
  const [querySkill, setQuerySkill] = useState('');
  const [networkResult, setNetworkResult] = useState<{ query: string; results: any[] } | null>(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    setPerson(null);
    setGraph(null);
    setNetworkResult(null);
    setError(null);
    Promise.all([api.people.get(id), api.people.graph(id)])
      .then(([p, g]) => {
        setPerson(p);
        setGraph(g);
      })
      .catch((e) => setError(e.message));
    api.skills.list().then(setAllSkills).catch(() => {});
  }, [id]);

  function runSkillSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!querySkill) return;
    setSearching(true);
    api.people
      .findSkillInNetwork(id, querySkill)
      .then(setNetworkResult)
      .finally(() => setSearching(false));
  }

  if (error) return <ErrorState message={error} />;
  if (!person) return <LoadingRows count={4} height={60} />;

  return (
    <div>
      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <Avatar name={person.name} color={person.avatarColor} size={64} />
        <div style={{ flex: 1, minWidth: 240 }}>
          <h2 style={{ marginBottom: '0.15rem' }}>{person.name}</h2>
          <div style={{ color: 'var(--parchment-dim)' }}>{person.title} &middot; {person.seniority}</div>
          <p style={{ marginTop: '0.6rem', maxWidth: 560 }}>{person.bio}</p>
          {person.manager && (
            <div style={{ fontSize: '0.85rem' }}>
              Reports to{' '}
              <Link to={`/people/${person.manager.id}`}>{person.manager.name}</Link>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(280px,420px)', gap: '2rem', marginTop: '2rem' }}>
        <div>
          <h3 style={{ fontSize: '1rem' }}>Skills</h3>
          {person.skills.length === 0 ? (
            <EmptyState title="No skills recorded yet." />
          ) : (
            <div style={{ display: 'grid', gap: '0.6rem' }}>
              {person.skills.map((s) => (
                <div key={s.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.7rem 1rem' }}>
                  <div>
                    <div style={{ color: 'var(--parchment)' }}>{s.name}</div>
                    <div className="eyebrow">{s.category}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <SkillLevelBar level={s.level} />
                    <div style={{ fontSize: '0.75rem', marginTop: '0.2rem' }}>{s.years}y experience</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <h3 style={{ fontSize: '1rem', marginTop: '1.75rem' }}>Project history</h3>
          {person.projects.length === 0 ? (
            <EmptyState title="No projects recorded yet." />
          ) : (
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {person.projects.map((p) => (
                <Link key={p.id} to={`/projects/${p.id}`} className="card" style={{ textDecoration: 'none', display: 'flex', justifyContent: 'space-between', padding: '0.7rem 1rem' }}>
                  <div>
                    <div style={{ color: 'var(--parchment)' }}>{p.name}</div>
                    <div className="eyebrow">{p.role}</div>
                  </div>
                  <span className="pill">{p.status}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 style={{ fontSize: '1rem' }}>Network</h3>
          <div className="card" style={{ padding: '0.5rem' }}>
            {graph && (
              <NetworkGraph
                data={graph}
                centerId={person.id}
                width={380}
                height={300}
                onNodeClick={(n) => {
                  if (n.type === 'person') navigate(`/people/${n.id}`);
                  if (n.type === 'project') navigate(`/projects/${n.id}`);
                }}
              />
            )}
          </div>
          <p style={{ fontSize: '0.78rem' }}>
            Gold = {person.name.split(' ')[0]}, pale gold = direct skills &amp; projects, teal =
            colleagues reached through a shared project.
          </p>

          <h3 style={{ fontSize: '1rem', marginTop: '1.5rem' }}>Find a skill in this network</h3>
          <p style={{ fontSize: '0.85rem' }}>
            {person.name.split(' ')[0]} might not have a skill directly &mdash; but a past
            collaborator might. This runs a two-hop graph traversal to check.
          </p>
          <form onSubmit={runSkillSearch} style={{ display: 'flex', gap: '0.5rem' }}>
            <select
              value={querySkill}
              onChange={(e) => setQuerySkill(e.target.value)}
              style={{ flex: 1, background: 'var(--surface)', color: 'var(--parchment)', border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)', padding: '0.45rem' }}
            >
              <option value="">Choose a skill&hellip;</option>
              {allSkills.map((s) => (
                <option key={s.skill.id} value={s.skill.id}>{s.skill.name}</option>
              ))}
            </select>
            <button className="btn primary" type="submit" disabled={!querySkill}>Search</button>
          </form>

          {searching && <LoadingRows count={2} height={44} />}
          {networkResult && !searching && (
            <div style={{ marginTop: '0.75rem' }}>
              {networkResult.results.length === 0 ? (
                <EmptyState title="No one in this network has that skill yet." />
              ) : (
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  {networkResult.results.map((r: any) => (
                    <div key={r.person.id} className="card" style={{ padding: '0.6rem 0.85rem', fontSize: '0.85rem' }}>
                      <Link to={`/people/${r.person.id}`}>{r.person.name}</Link>
                      <div style={{ color: 'var(--parchment-dim)' }}>
                        Level {r.level} &middot; via {r.viaProject}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <CypherPanel query={networkResult.query} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
