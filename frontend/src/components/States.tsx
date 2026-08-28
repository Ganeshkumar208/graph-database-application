export function LoadingRows({ count = 3, height = 64 }: { count?: number; height?: number }) {
  return (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height }} />
      ))}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="error-state">
      <div className="eyebrow">Something went wrong</div>
      <p style={{ marginTop: '0.6rem', color: 'var(--parchment)' }}>{message}</p>
      {onRetry && (
        <button className="btn" onClick={onRetry} style={{ marginTop: '0.5rem' }}>
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="empty-state">
      <div className="eyebrow">Nothing here yet</div>
      <p style={{ marginTop: '0.6rem', color: 'var(--parchment)' }}>{title}</p>
      {hint && <p style={{ fontSize: '0.85rem' }}>{hint}</p>}
    </div>
  );
}
