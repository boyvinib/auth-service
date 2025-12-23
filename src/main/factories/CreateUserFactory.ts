import { CreateUserUseCase } from '../../application/use-cases/create-user/CreateUserUseCase'
import { CreateUserController } from '../../infrastructure/http/controllers/CreateUserController'
import { UserRepositoryPostgres } from '../../infrastructure/database/postgres/UserRepositoryPostgres'
import { BcryptPasswordHasher } from '../../infrastructure/security/BcryptPasswordHasher'

export function makeCreateUserController() {
  const userRepository = new UserRepositoryPostgres()
  const passwordHasher = new BcryptPasswordHasher()

  const useCase = new CreateUserUseCase(
    userRepository,
    passwordHasher
  )

  return new CreateUserController(useCase)
}
