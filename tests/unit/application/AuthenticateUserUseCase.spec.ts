import { AuthenticateUserUseCase } from '../../../src/application/use-cases/authenticate-user/AuthenticateUserUseCase'
import { UserRepositoryInMemory } from '../../mocks/UserRepositoryInMemory'
import { PasswordHasherFake } from '../../mocks/PasswordHasherFake'
import { TokenGeneratorFake } from '../../mocks/TokenGeneratorFake'
import { User } from '../../../src/domain/entities/User'
import { Password } from '../../../src/domain/value-objects/Password'

describe('AuthenticateUserUseCase', () => {
  let userRepository: UserRepositoryInMemory
  let passwordHasher: PasswordHasherFake
  let tokenGenerator: TokenGeneratorFake
  let useCase: AuthenticateUserUseCase

  beforeEach(() => {
    userRepository = new UserRepositoryInMemory()
    passwordHasher = new PasswordHasherFake()
    tokenGenerator = new TokenGeneratorFake()

    useCase = new AuthenticateUserUseCase(
      userRepository,
      passwordHasher,
      tokenGenerator
    )
  })

  it('should authenticate user and return token', async () => {
    const passwordVO = Password.create('Abc@123')
    const hashedPassword = await passwordHasher.hash(passwordVO.value)

    const user = new User({
      name: 'John Doe',
      email: 'john@mail.com',
      password: Password.restore(hashedPassword),
    })

    await userRepository.create(user)

    const result = await useCase.execute({
      email: 'john@mail.com',
      password: 'Abc@123',
    })

    expect(result.token).toBe(`token-${user.id}`)
  })

  it('should not authenticate with wrong email', async () => {
    await expect(
      useCase.execute({
        email: 'invalid@mail.com',
        password: 'Abc@123',
      })
    ).rejects.toThrow('Invalid credentials')
  })

  it('should not authenticate with wrong password', async () => {
    const passwordVO = Password.create('Abc@123')
    const hashedPassword = await passwordHasher.hash(passwordVO.value)

    const user = new User({
      name: 'John Doe',
      email: 'john@mail.com',
      password: Password.restore(hashedPassword),
    })

    await userRepository.create(user)

    await expect(
      useCase.execute({
        email: 'john@mail.com',
        password: 'Wrong@123',
      })
    ).rejects.toThrow('Invalid credentials')
  })
})
