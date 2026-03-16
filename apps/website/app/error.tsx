'use client';
export default function ErrorBoundary({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body><h2>Something went wrong!</h2></body>
    </html>
  );
}
