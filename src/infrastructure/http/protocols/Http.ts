export interface HttpRequest<T = any> {
  body?: T
  params?: any
  query?: any
  user?: {
    id: string
    email: string
  }
}

export interface HttpResponse {
  statusCode: number
  body?: any
}
