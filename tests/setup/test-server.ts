import Fastify from 'fastify'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'
import { UserRepositoryInMemory } from '../mocks/UserRepositoryInMemory'
import { PasswordHasherFake } from '../mocks/PasswordHasherFake'
import { TokenGeneratorJwtFake } from '../mocks/TokenGeneratorFake'
import { CreateUserUseCase } from '../../src/application/use-cases/create-user/CreateUserUseCase'
import { AuthenticateUserUseCase } from '../../src/application/use-cases/authenticate-user/AuthenticateUserUseCase'
import { CreateUserController } from '../../src/infrastructure/http/controllers/CreateUserController'
import { AuthenticateUserController } from '../../src/infrastructure/http/controllers/AuthenticateUserController'
import { fastifyAdapter } from '../../src/infrastructure/http/fastify/adapters/fastifyAdapter'
import { JwtTokenValidator } from '../../src/infrastructure/security/JwtTokenValidator'
import { UserRepository } from '../../src/domain/repositories/UserRepository'

export async function createTestServer() {
  console.log('createTestServer: POSTGRES_URL=', process.env.POSTGRES_URL)
  const app = Fastify({
    logger: false,
  })

  // Setup plugins
  app.register(swagger, {
    openapi: {
      info: {
        title: 'Auth Service (Test)',
        description: 'Authentication API with in-memory data',
        version: '1.0.0',
      },
    },
  })

  app.register(swaggerUI, {
    routePrefix: '/docs',
  })

  // choose repository based on environment (in-memory for fast tests, Postgres for real DB)
  const passwordHasher = new PasswordHasherFake()
  const tokenGenerator = new TokenGeneratorJwtFake('test-secret')
  const tokenValidator = new JwtTokenValidator('test-secret')

  // choose between in-memory or real Postgres repository
  let userRepository: UserRepository
  if (process.env.POSTGRES_URL) {
    console.log('Using Postgres repository')
    const mod = await import('../../src/infrastructure/database/postgres/UserRepositoryPostgres')
    userRepository = new mod.UserRepositoryPostgres()
  } else {
    console.log('Using in-memory repository')
    userRepository = new UserRepositoryInMemory()
  }

  // Create use cases
  const createUserUseCase = new CreateUserUseCase(userRepository, passwordHasher)
  const authenticateUserUseCase = new AuthenticateUserUseCase(
    userRepository,
    passwordHasher,
    tokenGenerator
  )

  // Create controllers
  const createUserController = new CreateUserController(createUserUseCase)
  const authenticateUserController = new AuthenticateUserController(authenticateUserUseCase)

  // Auth middleware
  const authPlugin = async (request: any, reply: any) => {
    try {
      const authHeader = request.headers.authorization
      if (!authHeader) {
        return reply.status(401).send({ message: 'Missing token' })
      }

      const token = authHeader.replace('Bearer ', '')
      const decoded = await tokenValidator.validate(token)

      if (!decoded) {
        return reply.status(401).send({ message: 'Invalid token' })
      }

      const user = await userRepository.findByEmail(decoded.email)
      if (!user) {
        return reply.status(401).send({ message: 'User not found' })
      }

      request.user = { id: user.id, email: user.email }
    } catch (error) {
      return reply.status(401).send({ message: 'Token validation failed' })
    }
  }

  // Routes
  app.post('/register', {
    schema: {
      tags: ['Auth'],
      body: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
        },
      },
    },
  }, async (request, reply) => {
    return fastifyAdapter(createUserController, request, reply)
  })

  app.post('/login', {
    schema: {
      tags: ['Auth'],
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
        },
      },
    },
  }, async (request, reply) => {
    return fastifyAdapter(authenticateUserController, request, reply)
  })

  app.get('/me', {
    preHandler: [authPlugin],
    schema: {
      tags: ['User'],
      security: [{ bearerAuth: [] }],
    },
  }, async (request: any, reply) => {
    return reply.send(request.user)
  })

  app.get('/health', async (request, reply) => {
    return reply.send({ status: 'ok' })
  })

  return app
}
