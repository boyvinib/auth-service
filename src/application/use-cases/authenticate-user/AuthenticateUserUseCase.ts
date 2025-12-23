import { UserRepository } from '../../../domain/repositories/UserRepository'
import { PasswordHasher } from '../../../domain/services/PasswordHasher'
import { TokenGenerator } from '../../../domain/services/TokenGenerator'
import { AuthenticateUserDTO } from '../../dtos/AuthenticateUserDTO'

export class AuthenticateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private passwordHasher: PasswordHasher,
    private tokenGenerator: TokenGenerator
  ) {}

  async execute(data: AuthenticateUserDTO): Promise<{ token: string }> {
    const user = await this.userRepository.findByEmail(data.email)

    if (!user) {
      throw new Error('Invalid credentials')
    }

    const passwordMatch = await this.passwordHasher.compare(
      data.password,
      user.password
    )

    if (!passwordMatch) {
      throw new Error('Invalid credentials')
    }

    const token = await this.tokenGenerator.generate({
      userId: user.id,
      email: user.email,
    })

    return { token }
  }
}
