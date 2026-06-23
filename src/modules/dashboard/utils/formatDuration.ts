export function formatDurationSeconds(seconds: number | null): string {
  if (seconds === null) {
    return '—'
  }

  if (seconds < 60) {
    return `${Math.max(1, Math.round(seconds))}s`
  }

  if (seconds < 3600) {
    return `${Math.round(seconds / 60)}m`
  }

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.round((seconds % 3600) / 60)

  if (minutes === 0) {
    return `${hours}h`
  }

  return `${hours}h ${minutes}m`
}
