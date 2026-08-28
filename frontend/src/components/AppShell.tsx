import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <header
        style={{
          borderBottom: '1px solid var(--line)',
          padding: '0.9rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          position: 'sticky',
          top: 0,
          background: 'rgba(18,22,42,0.9)',
          backdropFilter: 'blur(6px)',
          zIndex: 10,
        }}
      >
        <Link
          to="/"
          style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--parchment)', textDecoration: 'none' }}
        >
          Skill Graph
        </Link>
        <nav style={{ display: 'flex', gap: '1.25rem', fontSize: '0.9rem' }}>
          <NavItem to="/people">People</NavItem>
          <NavItem to="/projects">Projects</NavItem>
          <NavItem to="/skills">Skills</NavItem>
        </nav>
        <form onSubmit={onSearch} style={{ marginLeft: 'auto', width: 'min(320px, 40vw)' }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search people, skills, projects…"
            aria-label="Search"
            style={{
              width: '100%',
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: 999,
              padding: '0.5rem 0.9rem',
              color: 'var(--parchment)',
              fontSize: '0.85rem',
            }}
          />
        </form>
      </header>
      <main style={{ flex: 1, padding: '2rem 1.5rem', maxWidth: 1100, margin: '0 auto', width: '100%' }}>
        {children}
      </main>
      <footer style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--parchment-dim)', fontSize: '0.78rem' }}>
        Skill Graph &mdash; a CognoDB-backed take-home project.
      </footer>
    </div>
  );
}

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        color: isActive ? 'var(--gold)' : 'var(--parchment-dim)',
        textDecoration: 'none',
      })}
    >
      {children}
    </NavLink>
  );
}
