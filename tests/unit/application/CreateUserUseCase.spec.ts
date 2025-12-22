import { CreateUserUseCase } from '../../../src/application/use-cases/create-user/CreateUserUseCase'
import { UserRepositoryInMemory } from '../../mocks/UserRepositoryInMemory'
import { PasswordHasherFake } from '../../mocks/PasswordHasherFake'

describe('CreateUserUseCase', () => {
  let userRepository: UserRepositoryInMemory
  let passwordHasher: PasswordHasherFake
  let useCase: CreateUserUseCase

  beforeEach(() => {
    userRepository = new UserRepositoryInMemory()
    passwordHasher = new PasswordHasherFake()
    useCase = new CreateUserUseCase(userRepository, passwordHasher)
  })

  it('should create a user with hashed password', async () => {
    await useCase.execute({
      name: 'John Doe',
      email: 'john@mail.com',
      password: 'Abc@123',
    })

    expect(userRepository.users.length).toBe(1)
    expect(userRepository.users[0].email).toBe('john@mail.com')
    expect(userRepository.users[0].password).toBe('hashed-Abc@123')
  })

  it('should not allow duplicate email', async () => {
    await useCase.execute({
      name: 'John Doe',
      email: 'john@mail.com',
      password: 'Abc@123',
    })

    await expect(
      useCase.execute({
        name: 'John Doe',
        email: 'john@mail.com',
        password: 'Abc@123',
      })
    ).rejects.toThrow('User already exists')
  })

  it('should not allow weak password', async () => {
    await expect(
      useCase.execute({
        name: 'John Doe',
        email: 'john@mail.com',
        password: '123456',
      })
    ).rejects.toThrow()
  })
})
