export function Avatar({ name, color, size = 40 }: { name: string; color?: string; size?: number }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('');
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: color ?? 'var(--gold)',
        color: '#171a2c',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        fontSize: size * 0.4,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

/**
 * Small node-link diagrams for the home page feature cards, reusing the
 * exact shape/color language from NetworkGraph (gold circle = person, teal
 * diamond = skill) so the cards read as the app's own artifacts rather than
 * generic icon-and-text boxes.
 */
export function MiniGraph({ variant }: { variant: 'discover' | 'chemistry' | 'query' }) {
  const gold = '#d9a94a';
  const teal = '#6fa8a0';
  const rose = '#c97b7b';

  if (variant === 'discover') {
    return (
      <svg viewBox="0 0 120 56" width={120} height={56} aria-hidden="true">
        <line x1="16" y1="16" x2="60" y2="40" stroke={teal} strokeWidth="1.4" />
        <line x1="60" y1="40" x2="104" y2="16" stroke={gold} strokeWidth="1.4" />
        <line x1="16" y1="16" x2="104" y2="16" stroke={rose} strokeWidth="1.2" strokeDasharray="2 3" />
        <circle cx="16" cy="16" r="7" fill={gold} />
        <circle cx="60" cy="40" r="7" fill={teal} />
        <rect x="97" y="9" width="14" height="14" fill="none" stroke={gold} strokeWidth="1.6" transform="rotate(45 104 16)" />
      </svg>
    );
  }
  if (variant === 'chemistry') {
    return (
      <svg viewBox="0 0 120 56" width={120} height={56} aria-hidden="true">
        <line x1="20" y1="44" x2="60" y2="12" stroke={teal} strokeWidth="2.2" />
        <line x1="60" y1="12" x2="100" y2="44" stroke={teal} strokeWidth="1.2" />
        <line x1="20" y1="44" x2="100" y2="44" stroke={teal} strokeWidth="1.2" />
        <circle cx="20" cy="44" r="7" fill={gold} />
        <circle cx="60" cy="12" r="7" fill={gold} />
        <circle cx="100" cy="44" r="7" fill={gold} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 56" width={120} height={56} aria-hidden="true">
      <line x1="14" y1="28" x2="42" y2="28" stroke={teal} strokeWidth="1.4" />
      <circle cx="14" cy="28" r="6" fill={gold} />
      <circle cx="42" cy="28" r="6" fill={teal} />
      <path d="M62 12 L58 28 L62 44" fill="none" stroke="var(--parchment-dim)" strokeWidth="1.4" />
      <text x="70" y="24" fontFamily="var(--font-mono)" fontSize="9" fill={gold}>MATCH</text>
      <text x="70" y="36" fontFamily="var(--font-mono)" fontSize="9" fill="var(--parchment-dim)">(p)-[]-&gt;()</text>
      <path d="M108 12 L112 28 L108 44" fill="none" stroke="var(--parchment-dim)" strokeWidth="1.4" />
    </svg>
  );
}

export function SkillLevelBar({ level, max = 5 }: { level: number; max?: number }) {
  return (
    <div
      style={{ display: 'flex', gap: 3 }}
      role="img"
      aria-label={`Skill level ${level} of ${max}`}
    >
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          style={{
            width: 12,
            height: 5,
            borderRadius: 2,
            background: i < level ? 'var(--gold)' : 'var(--line)',
          }}
        />
      ))}
    </div>
  );
}
