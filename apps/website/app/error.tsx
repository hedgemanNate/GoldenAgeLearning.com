'use client';
export default function ErrorBoundary({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          borderRadius: '16px',
          border: '1px solid rgba(250, 245, 201, 0.12)',
          backgroundColor: 'rgba(30, 39, 44, 0.9)',
          padding: '24px',
          textAlign: 'center',
        }}
      >
        <h2 style={{ margin: '0 0 12px 0', fontSize: '24px' }}>Something went wrong</h2>
        <p style={{ margin: '0 0 20px 0', color: 'rgba(250, 245, 201, 0.75)' }}>
          An unexpected error interrupted this page.
        </p>
        <button
          onClick={reset}
          style={{
            border: 'none',
            borderRadius: '999px',
            padding: '10px 18px',
            backgroundColor: '#ec8b24',
            color: '#252d32',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
