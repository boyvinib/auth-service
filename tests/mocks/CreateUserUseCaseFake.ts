import { ICreateUserUseCase } from '../../src/application/use-cases/create-user/ICreateUserUseCase'
import { CreateUserDTO } from '../../src/application/dtos/CreateUserDTO'

export class CreateUserUseCaseFake implements ICreateUserUseCase {
  shouldThrowError = false
  errorMessage = ''

  async execute(data: CreateUserDTO): Promise<void> {
    if (this.shouldThrowError) {
      throw new Error(this.errorMessage)
    }
  }
}
