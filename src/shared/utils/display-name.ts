export function displayNameInitials(name: string): string {
  const normalized = name.trim().replace(/^@/, '')
  const parts = normalized.split(/\s+/).filter((part) => part.length > 0)

  if (parts.length === 0) {
    return '?'
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }

  const first = parts[0].charAt(0)
  const last = parts[parts.length - 1].charAt(0)
  return `${first}${last}`.toUpperCase()
}
