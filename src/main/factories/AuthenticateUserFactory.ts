import { AuthenticateUserUseCase } from '../../application/use-cases/authenticate-user/AuthenticateUserUseCase'
import { JwtTokenGenerator } from '../../infrastructure/security/JwtTokenGenerator'
import { BcryptPasswordHasher } from '../../infrastructure/security/BcryptPasswordHasher'
import { UserRepositoryPostgres } from '../../infrastructure/database/postgres/UserRepositoryPostgres'
import { AuthenticateUserController } from '../../infrastructure/http/controllers/AuthenticateUserController'

export function makeAuthenticateUserController() {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined')
  }

  const userRepository = new UserRepositoryPostgres()
  const passwordHasher = new BcryptPasswordHasher()
  const tokenGenerator = new JwtTokenGenerator(process.env.JWT_SECRET)

  const useCase = new AuthenticateUserUseCase(
    userRepository,
    passwordHasher,
    tokenGenerator
  )

  return new AuthenticateUserController(useCase)
}
