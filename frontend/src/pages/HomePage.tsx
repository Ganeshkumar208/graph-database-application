import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, GraphData } from '../api/client';
import { NetworkGraph } from '../components/NetworkGraph';
import { MiniGraph } from '../components/Bits';
import { LoadingRows, ErrorState } from '../components/States';

export function HomePage() {
  const [graph, setGraph] = useState<GraphData | null>(null);
  const [counts, setCounts] = useState<{ people: number; skills: number; projects: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([api.people.graph('p-priya'), api.people.list(), api.skills.list(), api.projects.list()])
      .then(([g, people, skills, projects]) => {
        setGraph(g);
        setCounts({ people: people.length, skills: skills.length, projects: projects.length });
      })
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div>
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr) minmax(280px, 480px)',
          gap: '2.5rem',
          alignItems: 'center',
          paddingBottom: '2.5rem',
          borderBottom: '1px solid var(--line)',
        }}
      >
        <div>
          <div className="eyebrow">A staffing graph, not a spreadsheet</div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginTop: '0.5rem' }}>
            Every project is a constellation of people.
          </h1>
          <p style={{ fontSize: '1.05rem', maxWidth: 480 }}>
            Skill Graph maps who knows what, who's worked with whom, and how a skill you need
            travels through your team &mdash; even when the closest person to it isn't the one
            you asked. It's backed end-to-end by CognoDB, a graph database, because those
            connections are the actual data model, not an afterthought bolted onto tables.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <Link className="btn primary" to="/people">Browse people</Link>
            <Link className="btn" to="/projects">Browse projects</Link>
          </div>
          {counts && (
            <div style={{ display: 'flex', gap: '2rem', marginTop: '2.5rem' }}>
              <Stat label="People" value={counts.people} />
              <Stat label="Skills" value={counts.skills} />
              <Stat label="Projects" value={counts.projects} />
            </div>
          )}
        </div>
        <div className="card" style={{ padding: '0.5rem' }}>
          {error && <ErrorState message={error} />}
          {!error && !graph && <LoadingRows count={1} height={340} />}
          {graph && (
            <>
              <NetworkGraph
                data={graph}
                centerId="p-priya"
                width={440}
                height={340}
                onNodeClick={(n) => {
                  if (n.type === 'person') navigate(`/people/${n.id}`);
                }}
              />
              <p style={{ fontSize: '0.75rem', textAlign: 'center', margin: '0.25rem 0 0.5rem' }}>
                Priya Nair's actual graph &mdash; skills, projects, and colleagues reached through them.
              </p>
            </>
          )}
        </div>
      </section>

      <section style={{ paddingTop: '2.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        <FeatureCard
          index={0}
          variant="discover"
          title="Find the skill, not just the person"
          body="Search a skill and see who has it directly, plus who's one collaboration away from it through a shared project."
        />
        <FeatureCard
          index={1}
          variant="chemistry"
          title="Staff a project with chemistry, not just qualifications"
          body="Team suggestions favor people who've already worked together, computed from the shape of the graph itself."
        />
        <FeatureCard
          index={2}
          variant="query"
          title="See the query, not just the result"
          body="Every network view can show you the exact parameterized Cypher that produced it."
        />
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--gold)' }}>{value}</div>
      <div className="eyebrow">{label}</div>
    </div>
  );
}

function FeatureCard({
  title,
  body,
  variant,
  index,
}: {
  title: string;
  body: string;
  variant: 'discover' | 'chemistry' | 'query';
  index: number;
}) {
  return (
    <div className="card fade-item" style={{ ['--i' as any]: index }}>
      <MiniGraph variant={variant} />
      <h3 style={{ fontSize: '1.05rem', marginTop: '0.75rem' }}>{title}</h3>
      <p style={{ fontSize: '0.9rem' }}>{body}</p>
    </div>
  );
}
