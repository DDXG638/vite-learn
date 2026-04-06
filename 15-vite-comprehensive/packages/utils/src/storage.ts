/**
 * localStorage 封装，支持 JSON 序列化
 */
export const localStorage = {
  get<T>(key: string): T | null {
    const item = window.localStorage.getItem(key)
    if (!item) return null
    try {
      return JSON.parse(item) as T
    } catch {
      return null
    }
  },

  set<T>(key: string, value: T): void {
    window.localStorage.setItem(key, JSON.stringify(value))
  },

  remove(key: string): void {
    window.localStorage.removeItem(key)
  },

  clear(): void {
    window.localStorage.clear()
  }
}
