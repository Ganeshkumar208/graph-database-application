import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, ProjectDetail, TeamSuggestion } from '../api/client';
import { Avatar, SkillLevelBar } from '../components/Bits';
import { CypherPanel } from '../components/CypherPanel';
import { LoadingRows, ErrorState, EmptyState } from '../components/States';

export function ProjectDetailPage() {
  const { id = '' } = useParams();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<TeamSuggestion | null>(null);
  const [suggesting, setSuggesting] = useState(false);
  const [suggestError, setSuggestError] = useState<string | null>(null);

  useEffect(() => {
    setProject(null);
    setSuggestion(null);
    setError(null);
    api.projects.get(id).then(setProject).catch((e) => setError(e.message));
  }, [id]);

  function suggestTeam() {
    setSuggesting(true);
    setSuggestError(null);
    api.projects
      .suggestTeam(id)
      .then(setSuggestion)
      .catch((e) => setSuggestError(e.message))
      .finally(() => setSuggesting(false));
  }

  if (error) return <ErrorState message={error} />;
  if (!project) return <LoadingRows count={4} height={60} />;

  const currentTeamIds = new Set(project.team.map((t) => t.id));

  return (
    <div>
      <div className="eyebrow">{project.domain} &middot; {project.status}</div>
      <h2 style={{ marginTop: '0.3rem' }}>{project.name}</h2>
      <p style={{ maxWidth: 640 }}>{project.description}</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '2rem', marginTop: '1.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1rem' }}>Required skills</h3>
          {project.requiredSkills.length === 0 ? (
            <EmptyState title="No skill requirements recorded." />
          ) : (
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {project.requiredSkills.map((s) => (
                <div key={s.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.9rem' }}>
                  <Link to={`/skills/${s.id}`}>{s.name}</Link>
                  <span style={{ fontSize: '0.8rem', color: 'var(--parchment-dim)' }}>min level {s.minLevel}</span>
                </div>
              ))}
            </div>
          )}

          <h3 style={{ fontSize: '1rem', marginTop: '1.5rem' }}>Current team</h3>
          {project.team.length === 0 ? (
            <EmptyState title="No one staffed yet." hint="Try suggesting a team." />
          ) : (
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {project.team.map((t) => (
                <Link key={t.id} to={`/people/${t.id}`} className="card" style={{ textDecoration: 'none', display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '0.6rem 0.9rem' }}>
                  <Avatar name={t.name} color={t.avatarColor} size={34} />
                  <div>
                    <div style={{ color: 'var(--parchment)' }}>{t.name}</div>
                    <div className="eyebrow">{t.role}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem' }}>Suggest a team</h3>
            <button className="btn primary" onClick={suggestTeam} disabled={suggesting}>
              {suggesting ? 'Thinking…' : 'Suggest team'}
            </button>
          </div>
          <p style={{ fontSize: '0.85rem' }}>
            Ranks qualified people by skill level, then by how many other
            qualified candidates for this project they've already
            collaborated with &mdash; a graph-native way to favor a team with
            existing chemistry.
          </p>

          {suggesting && <LoadingRows count={3} height={70} />}
          {suggestError && <ErrorState message={suggestError} onRetry={suggestTeam} />}

          {suggestion && (
            <>
              {suggestion.suggestions.length === 0 ? (
                <EmptyState title="No qualified candidates found for this project's requirements." />
              ) : (
                <div style={{ display: 'grid', gap: '1rem', marginTop: '0.5rem' }}>
                  {suggestion.suggestions.map((group) => (
                    <div key={group.skill.id}>
                      <div className="eyebrow">{group.skill.name}</div>
                      <div style={{ display: 'grid', gap: '0.4rem', marginTop: '0.4rem' }}>
                        {group.candidates.slice(0, 4).map((c) => (
                          <div key={c.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.55rem 0.85rem' }}>
                            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                              <Avatar name={c.name} color={c.avatarColor} size={30} />
                              <div>
                                <Link to={`/people/${c.id}`} style={{ color: 'var(--parchment)' }}>{c.name}</Link>
                                <div style={{ fontSize: '0.75rem' }}>{c.title}</div>
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <SkillLevelBar level={c.level} />
                              {c.networkStrength > 0 && (
                                <div style={{ fontSize: '0.72rem', color: 'var(--teal)' }}>
                                  worked with {c.networkStrength} other candidate{c.networkStrength === 1 ? '' : 's'}
                                </div>
                              )}
                              {currentTeamIds.has(c.id) && (
                                <div style={{ fontSize: '0.72rem', color: 'var(--gold)' }}>already on team</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <CypherPanel query={suggestion.query} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
