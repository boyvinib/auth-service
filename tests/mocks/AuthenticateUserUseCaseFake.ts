import { IAuthenticateUserUseCase } from '../../src/application/use-cases/authenticate-user/IAuthenticateUserUseCase'
import { AuthenticateUserDTO } from '../../src/application/dtos/AuthenticateUserDTO'

export class AuthenticateUserUseCaseFake implements IAuthenticateUserUseCase {
  shouldThrowError = false
  errorMessage = ''
  tokenToReturn = 'fake-token-123'

  async execute(data: AuthenticateUserDTO): Promise<{ token: string }> {
    if (this.shouldThrowError) {
      throw new Error(this.errorMessage)
    }
    return { token: this.tokenToReturn }
  }
}
