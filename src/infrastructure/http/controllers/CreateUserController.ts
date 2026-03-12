import { ICreateUserUseCase } from '../../../application/use-cases/create-user/ICreateUserUseCase'
import { HttpRequest, HttpResponse } from '../protocols/Http'

export class CreateUserController {
  constructor(private readonly useCase: ICreateUserUseCase) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { name, email, password } = request.body!

      await this.useCase.execute({ name, email, password })

      return {
        statusCode: 201,
        body: { message: 'User created successfully' },
      }
    } catch (error: any) {
      return {
        statusCode: 400,
        body: { message: error.message },
      }
    }
  }
}
