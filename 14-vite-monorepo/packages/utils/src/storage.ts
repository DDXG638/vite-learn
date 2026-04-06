/**
 * LocalStorage 包装器，提供类型安全的存取
 */
export const localStorage = {
  get<T>(key: string): T | null {
    const item = window.localStorage.getItem(key)
    if (!item) return null
    try {
      return JSON.parse(item) as T
    } catch {
      return item as unknown as T
    }
  },

  set<T>(key: string, value: T): void {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value)
    window.localStorage.setItem(key, serialized)
  },

  remove(key: string): void {
    window.localStorage.removeItem(key)
  },

  clear(): void {
    window.localStorage.clear()
  }
}
