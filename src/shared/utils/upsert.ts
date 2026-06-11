export function upsertByKey<T>(items: T[], updated: T, key: keyof T): T[] {
  const exists = items.some((item) => item[key] === updated[key])
  if (!exists) {
    return [updated, ...items]
  }
  return items.map((item) => (item[key] === updated[key] ? updated : item))
}

export function mergeByKey<T>(items: T[], updated: T, key: keyof T): T[] {
  return items.map((item) => (item[key] === updated[key] ? { ...item, ...updated } : item))
}
