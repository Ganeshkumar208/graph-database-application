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
