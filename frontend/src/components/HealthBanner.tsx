import { useEffect, useState } from 'react';
import { api } from '../api/client';

export function HealthBanner() {
  const [status, setStatus] = useState<'ok' | 'degraded' | 'unknown'>('unknown');

  useEffect(() => {
    let cancelled = false;
    api.health().then((res) => {
      if (!cancelled) setStatus(res?.status === 'ok' ? 'ok' : 'degraded');
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (status !== 'degraded') return null;

  return (
    <div
      role="alert"
      style={{
        background: '#3a2430',
        color: '#f0d7d7',
        borderBottom: '1px solid var(--rose)',
        padding: '0.6rem 1.5rem',
        fontSize: '0.85rem',
        textAlign: 'center',
      }}
    >
      The graph database is unreachable right now, so pages may fail to load. Check the API's
      NEO4J_URI / NEO4J_USERNAME / NEO4J_PASSWORD and that your CognoDB instance is running.
    </div>
  );
}
