import { useState } from 'react';

export function CypherPanel({ query }: { query: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop: '0.75rem' }}>
      <button
        className="btn"
        style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {open ? 'Hide the Cypher' : 'View the Cypher behind this'}
      </button>
      {open && (
        <pre
          className="mono"
          style={{
            marginTop: '0.6rem',
            background: '#0e1224',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius-sm)',
            padding: '1rem',
            fontSize: '0.82rem',
            lineHeight: 1.6,
            color: '#c9e4df',
            overflowX: 'auto',
          }}
        >
          {query}
        </pre>
      )}
    </div>
  );
}
