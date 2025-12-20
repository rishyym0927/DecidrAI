/**
 * Global Loading State
 * Shows during route transitions
 */

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="text-center">
        <div className="inline-block animate-spin text-5xl mb-4">⚡</div>
        <p className="text-[var(--muted)] text-lg">Loading...</p>
      </div>
    </div>
  );
}
