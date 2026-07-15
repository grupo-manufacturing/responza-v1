export function mergeByKey<T>(items: T[], updated: T, key: keyof T): T[] {
  return items.map((item) => (item[key] === updated[key] ? { ...item, ...updated } : item))
}
