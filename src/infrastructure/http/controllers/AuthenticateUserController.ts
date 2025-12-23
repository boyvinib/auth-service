import { Request, Response } from 'express'
import { AuthenticateUserUseCase } from '../../../application/use-cases/authenticate-user/AuthenticateUserUseCase'

export class AuthenticateUserController {
  constructor(private readonly useCase: AuthenticateUserUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body

      const result = await this.useCase.execute({ email, password })

      return res.status(200).json(result)
    } catch (error: any) {
      return res.status(401).json({
        message: 'Invalid credentials',
      })
    }
  }
}
