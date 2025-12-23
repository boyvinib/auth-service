import { AuthenticateUserUseCase } from '../../../application/use-cases/authenticate-user/AuthenticateUserUseCase'
import { HttpRequest, HttpResponse } from '../protocols/Http'

export class AuthenticateUserController {
  constructor(private readonly useCase: AuthenticateUserUseCase) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = request.body!

      const result = await this.useCase.execute({ email, password })

      return {
        statusCode: 200,
        body: result,
      }
    } catch {
      return {
        statusCode: 401,
        body: { message: 'Invalid credentials' },
      }
    }
  }
}
