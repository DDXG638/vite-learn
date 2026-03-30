export interface User {
  id: number
  name: string
  email: string
}

export interface ApiResponse<T> {
  code: number
  data: T
  message: string
}