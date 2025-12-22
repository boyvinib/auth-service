import { User } from '../../../domain/entities/User'
import { Password } from '../../../domain/value-objects/Password'
import { UserRepository } from '../../../domain/repositories/UserRepository'
import { PasswordHasher } from '../../../domain/services/PasswordHasher'
import { CreateUserDTO } from '../../dtos/CreateUserDTO'

export class CreateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private passwordHasher: PasswordHasher
  ) {}

  async execute(data: CreateUserDTO): Promise<void> {
    const userAlreadyExists = await this.userRepository.findByEmail(data.email)

    if (userAlreadyExists) {
      throw new Error('User already exists')
    }

    const passwordVO = Password.create(data.password)
    const hashedPassword = await this.passwordHasher.hash(passwordVO.value)

    const user = new User({
      name: data.name,
      email: data.email,
      password: Password.restore(hashedPassword),
    })

    await this.userRepository.create(user)
  }
}
