import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, GraphData, SkillDetail } from '../api/client';
import { Avatar, SkillLevelBar } from '../components/Bits';
import { NetworkGraph } from '../components/NetworkGraph';
import { LoadingRows, ErrorState, EmptyState } from '../components/States';

export function SkillDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [skill, setSkill] = useState<SkillDetail | null>(null);
  const [graph, setGraph] = useState<GraphData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSkill(null);
    setGraph(null);
    setError(null);
    Promise.all([api.skills.get(id), api.skills.graph(id)])
      .then(([s, g]) => {
        setSkill(s);
        setGraph(g);
      })
      .catch((e) => setError(e.message));
  }, [id]);

  if (error) return <ErrorState message={error} />;
  if (!skill) return <LoadingRows count={4} height={60} />;

  return (
    <div>
      <div className="eyebrow">{skill.category}</div>
      <h2 style={{ marginTop: '0.3rem' }}>{skill.name}</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(280px,420px)', gap: '2rem', marginTop: '1.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1rem' }}>People with this skill</h3>
          {skill.experts.length === 0 ? (
            <EmptyState title="No one has this skill yet." />
          ) : (
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {skill.experts.map((e) => (
                <Link key={e.id} to={`/people/${e.id}`} className="card" style={{ textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.9rem' }}>
                  <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                    <Avatar name={e.name} color={e.avatarColor} size={32} />
                    <div>
                      <div style={{ color: 'var(--parchment)' }}>{e.name}</div>
                      <div className="eyebrow">{e.title}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <SkillLevelBar level={e.level} />
                    <div style={{ fontSize: '0.75rem' }}>{e.years}y</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 style={{ fontSize: '1rem' }}>Who could pick this up next</h3>
          <div className="card" style={{ padding: '0.5rem' }}>
            {graph && (
              <NetworkGraph
                data={graph}
                centerId={skill.id}
                width={380}
                height={300}
                onNodeClick={(n) => {
                  if (n.type === 'person') navigate(`/people/${n.id}`);
                }}
              />
            )}
          </div>
          <p style={{ fontSize: '0.78rem' }}>
            Pale gold = people who already have {skill.name}. Teal = colleagues
            of theirs who've worked together but don't have it yet &mdash;
            found by a two-hop traversal from skill to expert to project to colleague.
          </p>
        </div>
      </div>
    </div>
  );
}
