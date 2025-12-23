import { Request, Response } from 'express'
import { CreateUserUseCase } from '../../../application/use-cases/create-user/CreateUserUseCase'

export class CreateUserController {
  constructor(private readonly useCase: CreateUserUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password } = req.body

      await this.useCase.execute({ name, email, password })

      return res.status(201).send()
    } catch (error: any) {
      return res.status(400).json({
        message: error.message,
      })
    }
  }
}
